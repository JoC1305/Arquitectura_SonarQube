// Validar campo requerido
export const validarRequerido = (valor) => {
  if (!valor || valor.trim() === '') {
    return {
      isValid: false,
      errorMessage: 'Este campo es requerido'
    }
  }
  return { isValid: true }
}

// Validar formato de email
export const validarFormatoEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email || !emailRegex.test(email)) {
    return {
      isValid: false,
      errorMessage: 'Por favor, ingresa un email válido'
    }
  }
  return { isValid: true }
}

export const actualizarErrorEmail = (errors, email) => {
  const validation = validarFormatoEmail(email)
  if (validation.isValid) {
    const { email,...rest } = errors
    return rest
  }
  return { ...errors, email: validation.errorMessage }
}

// Validar contraseña compleja
export const validarPasswordCompleja = (password) => {
  if (!password || password.length < 6) {
    return {
      isValid: false,
      errorMessage: 'La contraseña debe tener al menos 6 caracteres'
    }
  }
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      errorMessage: 'La contraseña debe contener al menos una mayúscula'
    }
  }
  if (!/\d/.test(password)) {
    return {
      isValid: false,
      errorMessage: 'La contraseña debe contener al menos un número'
    }
  }
  return { isValid: true }
}

// Validar confirmación de clave
export const validarConfirmacionClave = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return {
      isValid: false,
      errorMessage: 'Las contraseñas no coinciden'
    }
  }
  return { isValid: true }
}

// Validar reseña
export const validarResena = (texto, minWords = 5, maxWords = 50) => {
    const textoLimpio = (texto || '').trim();
    const palabras = textoLimpio.length ? textoLimpio.split(/\s+/) : [];
    const numPalabras = palabras.filter(p => p.length > 0).length;

    const malasPalabras = ["tonto", "idiota", "imbecil", "estupido", "mierda", "basura", "maldito", "asqueroso"];
    const contieneMalaPalabra = malasPalabras.some(palabra =>
        textoLimpio.toLowerCase().includes(palabra)
    );

    // Detectar enlaces/URLs:
    // - http:// o https://
    // - www.
    // - mailto:
    // - etiquetas HTML <a ...>
    // - dominios con TLD comunes (.com, .net, .org, .io, .es, .co, .info, .biz, .me, .edu, .gov)
    const urlRegex = /(?:https?:\/\/[^\s]+)|(?:www\.[^\s]+)|(?:mailto:[^\s]+)|(?:<a\b[^>]*>[\s\S]*?<\/a>)|(?:\b[a-z0-9-]+(?:\.[a-z0-9-]+)+\.(?:com|net|org|io|es|co|info|biz|me|edu|gov)\b)/i;
    const contieneLink = urlRegex.test(textoLimpio);

    let isValid = true;
    let errorMessage = null;
    let errorCode = null;

    if (numPalabras < minWords) {
        isValid = false;
        errorMessage = `La reseña debe tener al menos ${minWords} palabras.`;
        errorCode = "TOO_SHORT";
    } else if (numPalabras > maxWords) {
        isValid = false;
        errorMessage = `La reseña no puede exceder las ${maxWords} palabras.`;
        errorCode = "TOO_LONG";
    } else if (contieneLink) {
        isValid = false;
        errorMessage = "No se permiten enlaces o URLs en la reseña.";
        errorCode = "CONTAINS_LINK";
    } else if (contieneMalaPalabra) {
        isValid = false;
        errorMessage = "Tu reseña contiene palabras inapropiadas.";
        errorCode = "BAD_LANGUAGE";
    } else if (textoLimpio && textoLimpio === textoLimpio.toUpperCase()) {
        isValid = false;
        errorMessage = "No escribas tu reseña completamente en mayúsculas.";
        errorCode = "ALL_UPPERCASE";
    }

    return {
        isValid,
        errorMessage,
        errorCode,
        parameters: { value: texto, numPalabras, minWords, maxWords, contieneMalaPalabra, contieneLink }
    };
}
