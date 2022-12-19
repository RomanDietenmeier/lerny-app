'use strict';
function onKeyDown(evt: KeyboardEvent) {
    window.keyPressMap[evt.key] = true;
}

function onKeyUp(evt: KeyboardEvent) {
    window.keyPressMap[evt.key] = false;
}

export async function initKeyboardCapture() {
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
    window.keyPressMap = {};
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('focus', () => {
        //reset keyPressMap as focus was lost
        window.keyPressMap = {};
    });
}
