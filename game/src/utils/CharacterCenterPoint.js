export function centerPointCharacterProxy(characterProxy) {
    const currentNode = characterProxy.currentNode;
    return new pc.Vec3(currentNode.x,
        currentNode.y + characterProxy.height * 0.5,
        currentNode.z);
}