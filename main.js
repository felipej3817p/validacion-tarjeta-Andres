// --- Elementos del DOM ---
const input = document.getElementById('inputNumber');
const display = document.getElementById('displayNumber');
const brandLogo = document.getElementById('brandLogo');
const card = document.getElementById('creditCard');
const statusMsg = document.getElementById('statusMsg');
const btn = document.getElementById('validateBtn');
const btnText = document.getElementById('btnText');
const spinner = document.getElementById('btnSpinner');

// --- Algoritmo de Luhn (El código que ya funciona) ---
function luhnCheck(val) {
    let sum = 0;
    let shouldDouble = false;
    for (let i = val.length - 1; i >= 0; i--) {
        let digit = parseInt(val.charAt(i));
        if (shouldDouble) {
            if ((digit *= 2) > 9) digit -= 9;
        }
        sum += digit;
        shouldDouble = !shouldDouble;
    }
    return (sum % 10) == 0;
}

// --- Detección de Marca (El código que identifica las tarjetas) ---
function updateBrand(number) {
    brandLogo.className = 'card-brand active';
    
    // VISA: Empieza con 4
    if (number.startsWith('4')) {
        brandLogo.innerHTML = '<i class="fab fa-cc-visa" style="color:#fff;"></i>';
    
    // MASTERCARD: Empieza con 51-55 o 22-27
    } else if (/^5[1-5]/.test(number) || /^2[2-7]/.test(number)) {
        brandLogo.innerHTML = '<i class="fab fa-cc-mastercard" style="color:#ff9f00;"></i>';
    
    // AMEX: Empieza con 34 o 37
    } else if (/^3[47]/.test(number)) {
        brandLogo.innerHTML = '<i class="fab fa-cc-amex" style="color:#00a4e0;"></i>';
    
    // Genérico
    } else {
        brandLogo.className = 'card-brand';
        brandLogo.innerHTML = '<i class="fas fa-credit-card"></i>';
    }
}

// --- Lógica de la Interfaz ---
function showResult(isValid, msg) {
    statusMsg.style.opacity = '1';
    
    if(isValid) {
        card.classList.add('card-glow-success');
        statusMsg.className = 'status-container status-success';
        statusMsg.innerHTML = `<i class="fas fa-check-circle" style="margin-right:8px"></i> ${msg}`;
    } else {
        card.classList.add('card-glow-error');
        statusMsg.className = 'status-container status-error';
        statusMsg.innerHTML = `<i class="fas fa-times-circle" style="margin-right:8px"></i> ${msg}`;
    }
}

function resetState() {
    card.classList.remove('card-glow-success', 'card-glow-error');
    statusMsg.style.opacity = '0';
}

function startValidation() {
    const rawNumber = input.value.replace(/\s/g, '');
    
    if(rawNumber.length < 13) {
        showResult(false, 'Número incompleto');
        return;
    }

    // UI: Estado de Carga
    btn.disabled = true;
    btnText.textContent = 'Verificando...';
    spinner.style.display = 'block';
    resetState();

    // Simular espera de red (1.2s)
    setTimeout(() => {
        const isValid = luhnCheck(rawNumber);
        
        // UI: Restaurar botón
        btn.disabled = false;
        btnText.textContent = 'Validar Tarjeta';
        spinner.style.display = 'none';

        if(isValid) {
            showResult(true, 'Tarjeta Verificada Correctamente');
        } else {
            showResult(false, 'Número de Tarjeta Inválido');
        }
    }, 1200);
}

// --- Event Listeners para el Funcionamiento en Vivo ---

// 1. Detección de entrada en vivo (Formato y Marca)
input.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    let formatted = '';

    // Llama a la función de detección de marca
    updateBrand(value);

    // Formatear espacios
    for(let i=0; i<value.length; i++) {
        if(i>0 && i%4===0) formatted += ' ';
        formatted += value[i];
    }
    input.value = formatted;
    
    // Actualizar tarjeta visual
    display.textContent = value.length ? formatted : '#### #### #### ####';
    
    resetState(); // Limpiar estados anteriores
});

// 2. Evento del Botón
btn.addEventListener('click', startValidation);