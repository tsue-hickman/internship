import ( useSound ) from '@vueuse/sound'

export const sounds = {
    click: useSound('/sounds/click.mp3'),
    hover: useSound('/sounds/hover.mp3'),
    success: useSound('/sounds/success.mp3'),
    error: useSound('/sounds/error.mp3')
}