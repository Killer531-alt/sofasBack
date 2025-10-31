# Configuración
$baseUrl = "https://sofasback.onrender.com/api"
$mainUrl = "https://sofasback.onrender.com"
$headers = @{
    'Content-Type' = 'application/json'
}

# Función para hacer POST
function Make-Post {
    param (
        [string]$endpoint,
        [object]$data
    )
    try {
        Write-Host "Enviando a $baseUrl/$endpoint" -ForegroundColor Yellow
        
        # Convertir a JSON sin doble escape
        $jsonBody = $data | ConvertTo-Json -Depth 10 -Compress
        
        Write-Host "Body:" -ForegroundColor Yellow
        Write-Host $jsonBody
        
        $response = Invoke-RestMethod -Uri "$baseUrl/$endpoint" `
                                    -Method Post `
                                    -Headers $headers `
                                    -Body ([System.Text.Encoding]::UTF8.GetBytes($jsonBody)) `
                                    -ContentType "application/json; charset=utf-8"
        
        Write-Host "Éxito: $($response._id)" -ForegroundColor Green
        return $response._id
    } catch {
        Write-Host "Error: $_" -ForegroundColor Red
        Write-Host "Response:" -ForegroundColor Red
        Write-Host $_.ErrorDetails
        return $null
    }
}

# Verificar la conexión al servidor
Write-Host "Verificando conexión al servidor..." -ForegroundColor Yellow
try {
    $serverCheck = Invoke-RestMethod -Uri $mainUrl -Method Get
    Write-Host "Servidor conectado exitosamente" -ForegroundColor Green
} catch {
    Write-Host "Error conectando al servidor: $_" -ForegroundColor Red
    exit
}

# Crear Facturas
Write-Host "`nCreando facturas..." -ForegroundColor Yellow

# Configuración de headers
$headers = @{
    'Accept' = 'application/json'
}

# Factura 1 - Sofa-cama Premium
$factura1 = @{
    fecha_emision = (Get-Date).ToString("yyyy-MM-dd")
    cliente = @{
        nombre = "Gabriel Martinez"
        correo = "gabriel.martinez@email.com"
        telefono = "313-555-5050"
        direccion = "Carrera 19 #85-70, Bogota"
    }
    items = @(
        @{
            producto = "68fb0dadf932156c16d774af" # Velvet Premium
            cantidad = 14
            precio_unitario = 125000
            subtotal = 1750000
        }
        @{
            producto = "68fb0daff932156c16d774b7" # Sistema Plegable
            cantidad = 1
            precio_unitario = 450000
            subtotal = 450000
        }
        @{
            producto = "68fb0daff932156c16d774b5" # Guayacán
            cantidad = 5
            precio_unitario = 180000
            subtotal = 900000
        }
    )
    subtotal = 3100000
    iva = 589000
    total = 3689000
    estado = "pendiente"
    metodo_pago = "40% anticipo, 60% contra entrega"
    notas = "Sofa-cama de lujo en velvet con sistema plegable importado. Tiempo de fabricacion: 35 dias habiles"
} | ConvertTo-Json -Depth 10

Write-Host "Creando Factura 1 - Sofá-cama Premium..." -ForegroundColor Cyan
$factura1Id = Make-Post "factura" $factura1
Start-Sleep -Seconds 1 # Pequeña pausa entre requests

# Factura 2 - Sala Ecológica
$factura2 = @{
    fecha_emision = (Get-Date).ToString("yyyy-MM-dd")
    cliente = @{
        nombre = "Catalina Sánchez"
        correo = "catalina.sanchez@email.com"
        telefono = "316-555-4040"
        direccion = "Calle 127 #15-23, Bogotá"
    }
    items = @(
        @{
            producto = "68fb0daef932156c16d774b1" # EcoFabric
            cantidad = 12
            precio_unitario = 145000
            subtotal = 1740000
        }
        @{
            producto = "68fb0daef932156c16d774b3" # Espuma Látex
            cantidad = 2
            precio_unitario = 220000
            subtotal = 440000
        }
    )
    subtotal = 2180000
    iva = 414200
    total = 2594200
    estado = "pendiente"
    metodo_pago = "50% anticipo, 50% contra entrega"
    notas = "Sofá ecológico de 3 puestos con materiales sustentables. Tiempo de fabricación: 25 días hábiles"
} | ConvertTo-Json -Depth 10

Write-Host "Creando Factura 2 - Sala Ecológica..." -ForegroundColor Cyan
$factura2Id = Make-Post "factura" $factura2

# Factura 3 - Juego de Sala Completo
$factura3 = @{
    fecha_emision = (Get-Date).ToString("yyyy-MM-dd")
    cliente = @{
        nombre = "Fernando Ruiz"
        correo = "fruiz@email.com"
        telefono = "310-555-3030"
        direccion = "Avenida Suba #115-50, Bogotá"
    }
    items = @(
        @{
            producto = "68fb0dadf932156c16d774af" # Velvet Premium
            cantidad = 25
            precio_unitario = 125000
            subtotal = 3125000
        }
        @{
            producto = "68fb0daef932156c16d774b3" # Espuma Látex
            cantidad = 5
            precio_unitario = 220000
            subtotal = 1100000
        }
        @{
            producto = "68fb0daff932156c16d774b5" # Guayacán
            cantidad = 12
            precio_unitario = 180000
            subtotal = 2160000
        }
        @{
            producto = "68fb0daff932156c16d774b7" # Sistema Plegable
            cantidad = 2
            precio_unitario = 450000
            subtotal = 900000
        }
    )
    subtotal = 7285000
    iva = 1384150
    total = 8669150
    estado = "pendiente"
    metodo_pago = "40% anticipo, 30% avance, 30% contra entrega"
    notas = "Juego de sala completo premium: sofá 3 puestos reclinable, love seat y dos poltronas. Tiempo de fabricación: 45 días hábiles"
} | ConvertTo-Json -Depth 10

Write-Host "Creando Factura 3 - Juego de Sala Completo..." -ForegroundColor Cyan
$factura3Id = Make-Post "factura" $factura3

# Verificar las facturas creadas
Write-Host "`nVerificando facturas creadas..." -ForegroundColor Yellow
try {
    $facturas = Invoke-RestMethod -Uri "$baseUrl/factura" -Method Get -Headers $headers
    Write-Host "Total de facturas en el sistema: $($facturas.Count)" -ForegroundColor Green
    
    foreach ($factura in $facturas) {
        Write-Host "`nFactura ID: $($factura._id)" -ForegroundColor Cyan
        Write-Host "Cliente: $($factura.cliente.nombre)" -ForegroundColor Cyan
        Write-Host "Total: $($factura.total)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "Error al verificar facturas: $_" -ForegroundColor Red
}

Write-Host "`nProceso completado!" -ForegroundColor Green