# Configuración
$baseUrl = "https://sofasback.onrender.com/api"
$headers = @{
    'Content-Type' = 'application/json'
}

# Función para hacer POST
function Make-Post {
    param (
        [string]$endpoint,
        [string]$body
    )
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/$endpoint" -Method Post -Headers $headers -Body $body
        Write-Host "Éxito: $($response._id)" -ForegroundColor Green
    } catch {
        Write-Host "Error: $_" -ForegroundColor Red
    }
}

# Nuevos Materiales

# 1. Telas Especiales
$velvetPremium = @{
    codigo = "TEL-005"
    nombre = "Velvet Premium"
    descripcion = "Tela tipo terciopelo de alta durabilidad"
    cantidad = 120
    precio_unitario = 125000
    unidad_medida = "metro"
    proveedor = "Textiles Premium"
    punto_reorden = 30
    categoria = "Telas"
} | ConvertTo-Json

$telaEcologica = @{
    codigo = "TEL-006"
    nombre = "EcoFabric"
    descripcion = "Tela sustentable hecha de materiales reciclados"
    cantidad = 90
    precio_unitario = 145000
    unidad_medida = "metro"
    proveedor = "EcoTextiles"
    punto_reorden = 25
    categoria = "Telas"
} | ConvertTo-Json

# 2. Espumas Especializadas
$espumaLatex = @{
    codigo = "ESP-003"
    nombre = "Espuma Látex Natural"
    descripcion = "Espuma de látex 100% natural, hipoalergénica"
    cantidad = 30
    precio_unitario = 220000
    unidad_medida = "plancha"
    proveedor = "Espumas Naturales"
    punto_reorden = 10
    categoria = "Espumas"
} | ConvertTo-Json

# 3. Materiales Estructurales
$maderaGuayacan = @{
    codigo = "MAD-003"
    nombre = "Guayacán"
    descripcion = "Madera de guayacán para estructuras de alta resistencia"
    cantidad = 60
    precio_unitario = 180000
    unidad_medida = "metro"
    proveedor = "Maderas Exóticas"
    punto_reorden = 15
    categoria = "Maderas"
} | ConvertTo-Json

# 4. Sistemas de Confort
$sistemaPlegable = @{
    codigo = "MEC-002"
    nombre = "Sistema Plegable Multifunción"
    descripcion = "Mecanismo plegable para sofá-cama"
    cantidad = 15
    precio_unitario = 450000
    unidad_medida = "unidad"
    proveedor = "Mecanismos Europeos"
    punto_reorden = 5
    categoria = "Mecanismos"
} | ConvertTo-Json

# Agregar materiales
Write-Host "Agregando nuevos materiales..."
Make-Post "inventario" $velvetPremium
Make-Post "inventario" $telaEcologica
Make-Post "inventario" $espumaLatex
Make-Post "inventario" $maderaGuayacan
Make-Post "inventario" $sistemaPlegable

# Facturas de ejemplo
$facturaEcologica = @{
    cliente = @{
        nombre = "Catalina Sánchez"
        correo = "catalina.sanchez@email.com"
        telefono = "316-555-4040"
        direccion = "Calle 127 #15-23, Bogotá"
    }
    items = @(
        @{
            producto = "ID_ECOFABRIC"
            cantidad = 12
            precio_unitario = 145000
            subtotal = 1740000
        }
        @{
            producto = "ID_ESPUMA_LATEX"
            cantidad = 2
            precio_unitario = 220000
            subtotal = 440000
        }
    )
    subtotal = 2180000
    iva = 414200
    total = 2594200
    metodo_pago = "50% anticipo, 50% contra entrega"
    notas = "Sofá ecológico de 3 puestos. Materiales sustentables. Tiempo de fabricación: 25 días hábiles"
} | ConvertTo-Json -Depth 10

$facturaSofaCama = @{
    cliente = @{
        nombre = "Gabriel Martínez"
        correo = "gabriel.martinez@email.com"
        telefono = "313-555-5050"
        direccion = "Carrera 19 #85-70, Bogotá"
    }
    items = @(
        @{
            producto = "ID_VELVET"
            cantidad = 14
            precio_unitario = 125000
            subtotal = 1750000
        }
        @{
            producto = "ID_SISTEMA_PLEGABLE"
            cantidad = 1
            precio_unitario = 450000
            subtotal = 450000
        }
        @{
            producto = "ID_GUAYACAN"
            cantidad = 5
            precio_unitario = 180000
            subtotal = 900000
        }
    )
    subtotal = 3100000
    iva = 589000
    total = 3689000
    metodo_pago = "40% anticipo, 60% contra entrega"
    notas = "Sofá-cama de lujo en velvet con sistema plegable importado. Tiempo de fabricación: 35 días hábiles"
} | ConvertTo-Json -Depth 10

# Crear facturas
Write-Host "`nCreando facturas de ejemplo..."
Make-Post "factura" $facturaEcologica
Make-Post "factura" $facturaSofaCama

Write-Host "`nProceso completado!"