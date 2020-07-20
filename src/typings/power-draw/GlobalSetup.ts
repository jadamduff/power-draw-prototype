export default class GlobalSetup {
    constructor() {
        window.addEventListener('keydown', (e: any) => {
            if (e.target.type !== 'text' && e.which !== 82) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        })
    }
}