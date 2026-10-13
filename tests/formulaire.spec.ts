import { expect, test } from '@playwright/test'

test('le formulaire signale les champs manquants, sans rien envoyer', async ({ page }) => {
  await page.goto('/contact')
  await page.getByRole('button', { name: 'Envoyer ma demande' }).click()
  await expect(page.locator('[data-resume]')).toBeVisible()
  await expect(page.getByText('Indiquez votre nom et votre prénom.').first()).toBeVisible()
  await expect(page.locator('#demande-contact-telephone')).toHaveAttribute('aria-invalid', 'true')
})

test('la formation passée dans l’adresse est présélectionnée', async ({ page }) => {
  await page.goto('/contact?formation=permis-a2#demande')
  await expect(page.locator('#demande-contact-formation')).toHaveValue('permis-a2')
})

test('une demande valide est confirmée après envoi', async ({ page }) => {
  await page.goto('/permis-b')
  await page.waitForTimeout(3200) // délai minimal de l’anti-spam
  const f = page.locator('#demande-permis-b')
  await expect(f.locator('select[name="formation"]')).toHaveValue('permis-b')
  await f.getByLabel('Nom et prénom').fill('Camille Test')
  await f.getByLabel('Téléphone').fill('06 12 34 56 78')
  await f.getByLabel('E-mail').fill('camille@exemple.fr')
  await f.getByRole('checkbox').check()
  await f.getByRole('button', { name: 'Envoyer ma demande' }).click()
  await expect(page.getByText('Votre demande est bien arrivée')).toBeVisible()
})

test('sans JavaScript, l’envoi mène à la page de confirmation', async ({ browser }) => {
  const contexte = await browser.newContext({ javaScriptEnabled: false })
  const page = await contexte.newPage()
  await page.goto('/contact')
  // En développement, le jeton de la page est frais : on respecte le délai minimal.
  await page.waitForTimeout(3200)
  const f = page.locator('#demande-contact')
  await f.getByLabel('Nom et prénom').fill('Camille Test')
  await f.getByLabel('Téléphone').fill('0612345678')
  await f.getByLabel('E-mail').fill('camille@exemple.fr')
  await f.locator('select[name="formation"]').selectOption('code-de-la-route')
  await f.getByRole('checkbox').check()
  await f.getByRole('button', { name: 'Envoyer ma demande' }).click()
  await expect(page).toHaveURL(/\/demande-envoyee$/)
  await contexte.close()
})

test('le menu mobile s’ouvre et se ferme', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Menu' }).click()
  await expect(page.locator('#menu-mobile')).toBeVisible()
  await page.getByRole('button', { name: 'Fermer le menu' }).click()
  await expect(page.locator('#menu-mobile')).toBeHidden()
})

test('la liste des documents filtre et retient les cases cochées', async ({ page }) => {
  await page.goto('/documents-inscription?formation=permis-am')
  await expect(page.locator('[data-piece="assr-am"]')).toBeAttached()
  await expect(page.locator('li:has([data-piece="code-obtenu"])')).toBeHidden()
  await page.locator('label[for="piece-identite"]').click()
  await page.reload()
  await expect(page.locator('#piece-identite')).toBeChecked()
})
