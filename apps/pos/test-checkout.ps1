# Test GCash Checkout
Write-Host "Testing GCash Checkout Flow..." -ForegroundColor Cyan
Write-Host ""

try {
    # Step 1: Get products
    Write-Host "Step 1: Fetching products..." -ForegroundColor Yellow
    $productsResponse = Invoke-RestMethod -Uri 'http://localhost:4000/api/products' -Method GET
    $products = $productsResponse.products
    Write-Host "SUCCESS: Found $($products.Count) products" -ForegroundColor Green
    Write-Host ""

    # Step 2: Create invoice
    Write-Host "Step 2: Creating invoice with GCash payment..." -ForegroundColor Yellow
    $invoiceBody = @{
        items = @(
            @{ productId = $products[0].id; qty = 2 }
        )
        paymentMethod = 'gcash'
    } | ConvertTo-Json

    $invoiceResponse = Invoke-RestMethod -Uri 'http://localhost:4000/api/invoices' -Method POST -ContentType 'application/json' -Body $invoiceBody
    $invoice = $invoiceResponse.invoice
    Write-Host "SUCCESS: Invoice created: $($invoice.reference)" -ForegroundColor Green
    Write-Host "   Total: PHP $($invoice.total)"
    Write-Host "   Status: $($invoice.status)"
    Write-Host ""

    # Step 3: Create GCash checkout
    Write-Host "Step 3: Creating GCash checkout session..." -ForegroundColor Yellow
    $checkoutBody = @{
        invoiceId = $invoice.id
    } | ConvertTo-Json

    $checkoutResponse = Invoke-RestMethod -Uri 'http://localhost:4000/api/payments/gcash/checkout' -Method POST -ContentType 'application/json' -Body $checkoutBody
    $checkout = $checkoutResponse.checkout

    Write-Host "SUCCESS: Checkout session created!" -ForegroundColor Green
    Write-Host "   Provider: $($checkout.provider)"
    Write-Host "   Reference: $($checkout.reference)"
    Write-Host "   Amount: PHP $($checkout.amount)"
    Write-Host "   Status: $($checkout.status)"
    Write-Host "   Checkout URL: $($checkout.checkoutUrl)"
    Write-Host ""

    Write-Host "SUCCESS! GCash checkout is working correctly!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "   1. Open the checkout URL in a browser"
    Write-Host "   2. Use test credentials:"
    Write-Host "      - GCash Number: 09123456789"
    Write-Host "      - OTP: 123456"
    Write-Host "   3. Complete the payment"
    Write-Host "   4. Check if the invoice updates to PAID status"

} catch {
    Write-Host "FAILED: Test failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Message -like "*PAYMONGO_SECRET_KEY*") {
        Write-Host ""
        Write-Host "ISSUE: PayMongo Secret Key is not configured properly!" -ForegroundColor Yellow
        Write-Host "Please check your .env file." -ForegroundColor Yellow
    }
}
