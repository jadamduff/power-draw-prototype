export function isDescendantOf(parentId: string, child: HTMLElement) {
    let node: any = child.parentElement;
    while (node != null) {
        if (node.id === parentId) {
            return true;
        }
        node = node.parentElement;
    }
    return false;
}

export function isDescendantOfClass(parentClassName: string, child: HTMLElement) {
    let node: any = child.parentElement;
    while (node != null) {
        if (node.className === parentClassName) {
            return true;
        }
        node = node.parentElement;
    }
    return false;
}

export function isOrIsDescendantOf(parentId: string, child: HTMLElement) {
    if (parentId === child.id) {
        return true;
    } else {
        return isDescendantOf(parentId, child);
    }
}

export function isOrIsDescendantOfClass(parentClassName: string, child: HTMLElement) {
    if (parentClassName === child.className) {
        return true;
    } else {
        return isDescendantOfClass(parentClassName, child);
    }
}