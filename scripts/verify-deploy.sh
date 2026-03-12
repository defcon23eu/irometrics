#!/bin/bash
# ============================================================
# IRO Metrics · Verification Script
# Ejecutar después de cada despliegue para validar fixes
# ============================================================

echo "🔍 VERIFICACIÓN POST-DEPLOY — IRO Metrics"
echo "=========================================="
echo ""

# 1. Verificar Git Status
echo "📦 1. Git Status"
git --no-pager log --oneline -3
echo ""
git status --short
echo ""

# 2. TypeScript Type Check
echo "🔧 2. TypeScript Type Check"
npx tsc --noEmit 2>&1 | head -20
if [ $? -eq 0 ]; then
    echo "✅ Sin errores de tipos"
else
    echo "❌ Errores de TypeScript detectados"
    exit 1
fi
echo ""

# 3. Build Production
echo "🏗️  3. Production Build"
npm run build > /tmp/build.log 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Build exitoso"
    tail -15 /tmp/build.log
else
    echo "❌ Build falló"
    cat /tmp/build.log
    exit 1
fi
echo ""

# 4. Tests Unitarios
echo "🧪 4. Tests Unitarios calculateRTC"
npx tsx src/lib/__tests__/iro-calculator.test.ts
if [ $? -eq 0 ]; then
    echo "✅ Tests pasaron"
else
    echo "❌ Tests fallaron"
    exit 1
fi
echo ""

# 5. Verificar exports
echo "📚 5. Verificar Exports de Funciones"
grep -E "export function calculate" src/lib/iro-calculator.ts | sed 's/export function /  ✓ /'
echo ""

# 6. Resumen de cambios
echo "📊 6. Resumen de Cambios (últimos 3 commits)"
git --no-pager diff HEAD~3 HEAD --stat
echo ""

# 7. Instrucciones SQL
echo "🔐 7. VERIFICACIÓN SQL EN SUPABASE (MANUAL)"
echo "=========================================="
echo "Copiar y ejecutar en Supabase SQL Editor:"
echo ""
cat scripts/verify-re_org_log.sql
echo ""

echo "✅ VERIFICACIÓN LOCAL COMPLETA"
echo ""
echo "⚠️  ACCIÓN REQUERIDA:"
echo "   1. Confirmar despliegue en Vercel:"
echo "      https://vercel.com/[proyecto]/deployments"
echo ""
echo "   2. Ejecutar SQL en Supabase (copiar arriba)"
echo "      Resultado esperado: estado 🟢 OK en todas las filas nuevas"
echo ""
echo "   3. Validar que re_org_log ya no sea NULL en responses nuevas"
