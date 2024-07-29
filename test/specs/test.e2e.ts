import { $, expect } from '@wdio/globals'

describe('Electron Testing', () => {
    it('should display loader on start', async () => {
        const handles = await browser.getWindowHandles()
        await browser.switchToWindow(handles[0])
        const header = $('.loader')
        await expect(header).toExist()
    })
    it.skip('should display Open Data Editor on header', async () => {
        const header = $('header')
        await expect(header).toHaveText(expect.stringContaining('Open Data Editor'))
    })
})

