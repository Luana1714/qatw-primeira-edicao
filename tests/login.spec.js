import { test, expect } from '@playwright/test';

import { obterCodigo2FA } from '../support/db';

import { LoginPage } from '../pages/LoginPage';
import { DashPage } from '../pages/DashPage';


test('Não deve conseguir logar quando a autenticação é inválida', async ({ page }) => {
  
  const usuario = {
    cpf: '00000014141',
    senha: '147258'
  }
  
  await page.goto('http://paybank-mf-auth:3000/signup');
  
  await page.getByRole('textbox', { name: 'Digite seu CPF' }).fill(usuario.cpf);
  await page.getByRole('button', { name: 'Continuar' }).click();

  for (const digito of usuario.senha) { 
    await page.getByRole('button', { name: digito }).click();
  }
  await page.getByRole('button', { name: 'Continuar' }).click();

  await page.getByRole('textbox', { name: '000000' }).fill('123456');
  await page.getByRole('button', { name: 'Verificar' }).click();

  await expect(page.locator('span')).toContainText('Código inválido. Por favor, tente novamente.');
});

test('Deve acessar a conta do usuário', async ({ page }) => {
  
  const loginPage = new LoginPage(page)
  const dashPage = new DashPage(page)

  const usuario = {
    cpf: '00000014141',
    senha: '147258'
  }
  
  await loginPage.acessarPagina()
  await loginPage.informaCpf(usuario.cpf)
  await loginPage.informaSenha(usuario.senha)

  //temporario
  await page.waitForTimeout(3000)
  const codigo = await obterCodigo2FA()

  await loginPage.informa2FA(codigo)

  //temporário
  await page.waitForTimeout(2000)

  expect (await dashPage.obterSaldo()).toHaveText('R$ 5.000,00')
});