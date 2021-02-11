export function getAdjacentPoints(point) {
    const points = []
    //North
    points.push(new pc.Vec3(point.x, point.y, point.z - 1));
    //East
    points.push(new pc.Vec3(point.x + 1, point.y, point.z));
    //West
    points.push(new pc.Vec3(point.x - 1, point.y, point.z));
    //South
    points.push(new pc.Vec3(point.x, point.y, point.z + 1));

    return points;
}