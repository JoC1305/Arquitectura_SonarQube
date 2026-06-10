const { validarPasswordCompleja } = require('./validations.js');

describe('validarPasswordCompleja', () => {
  
  test('debe fallar si la contraseña es muy corta', () => {
    const resultado = validarPasswordCompleja('Ab1');
    expect(resultado.isValid).toBe(false);
    expect(resultado.errorMessage).toBe('La contraseña debe tener al menos 6 caracteres');
  });

  test('debe fallar si falta una mayúscula', () => {
    const resultado = validarPasswordCompleja('abc1234');
    expect(resultado.isValid).toBe(false);
    expect(resultado.errorMessage).toBe('La contraseña debe contener al menos una mayúscula');
  });

  test('debe fallar si falta un número', () => {
    const resultado = validarPasswordCompleja('Abcdefg');
    expect(resultado.isValid).toBe(false);
    expect(resultado.errorMessage).toBe('La contraseña debe contener al menos un número');
  });

  test('debe ser válida si cumple con todos los requisitos', () => {
    const resultado = validarPasswordCompleja('Abc123');
    expect(resultado.isValid).toBe(true);
  });
});