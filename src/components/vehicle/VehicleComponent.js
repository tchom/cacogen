export const VehicleComponent = pc.createScript('VehicleComponent');

VehicleComponent.attributes.add("mass", {
    type: "number",
    title: "Mass",
    default: 3
});

VehicleComponent.attributes.add("maxSpeed", {
    type: "number",
    title: "Max Speed",
    default: 5
});

VehicleComponent.attributes.add("maxForce", {
    type: "number",
    title: "Max Force",
    default: 0.5
});

VehicleComponent.attributes.add("arriveThreshold", {
    type: "number",
    title: "Arrival Threshold",
    default: 1
});

VehicleComponent.prototype.initialize = function () {
    this.velocity = new pc.Vec3();
    this.steeringForce = new pc.Vec3();
}


VehicleComponent.prototype.processVelocity = function (dt) {
    const position = this.entity.getPosition();

    this.steeringForce = clampVec3(this.steeringForce, (this.maxForce));
    this.steeringForce = this.steeringForce.scale(1 / (this.mass));
    this.velocity = this.velocity.add(this.steeringForce);
    this.velocity = clampVec3(this.velocity, (this.maxSpeed * dt));

    this.steeringForce = new pc.Vec3();

    this.entity.setLocalPosition(position.add(this.velocity));

    const yRotation = getAngle(this.velocity) * 180 / Math.PI;
    this.entity.setEulerAngles(0, yRotation, 0);
}


VehicleComponent.prototype.seek = function (target, dt) {
    const position = this.entity.getLocalPosition();
    let desiredVelocity = target.clone().sub(position);
    desiredVelocity = desiredVelocity.normalize()
    desiredVelocity.scale(this.maxSpeed * dt);
    const force = desiredVelocity.sub(this.velocity);
    this.steeringForce = this.steeringForce.add(force);
}

VehicleComponent.prototype.arrive = function (target) {
    const position = this.entity.getPosition();
    let desiredVelocity = target.clone().sub(position).normalize().scale(this.maxSpeed);
    const distanceToTarget = position.distance(target);

    if (distanceToTarget > this.arrivalThreshold) {
        desiredVelocity = desiredVelocity.scale(this.maxSpeed);
    } else {
        desiredVelocity = desiredVelocity.scale((this.maxSpeed * distanceToTarget / this.arriveThreshold));

    }
    const force = desiredVelocity.sub(this.velocity);
    this.steeringForce = this.steeringForce.add(force);
}

function clampVec3(vec3, maxValue) {
    if (vec3.length() < maxValue) {
        return vec3;
    } else {
        return vec3.normalize().scale(maxValue);
    }
}

function getAngle(vec3) {
    return Math.atan2(vec3.x, vec3.z);
}