beforeEach(() => {
  jest.resetModules()
})

test('supabase client usa createClient con URL y KEY', () => {
  const mockCreateClient = jest.fn(() => ({ mocked: true }))

  jest.mock('@supabase/supabase-js', () => ({
    createClient: mockCreateClient,
  }))

  const { supabase } = require('./supabaseClient.js')

  // Asegurar que el cliente exportado proviene del createClient mockeado
  expect(mockCreateClient).toHaveBeenCalled()
  expect(supabase).toEqual({ mocked: true })
})
