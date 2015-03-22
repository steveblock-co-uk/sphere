function Vector(x, y, z) {
  this.x_ = x;
  this.y_ = y;
  this.z_ = z;
}

Vector.prototype.toString = function() {
  return "(" + this.x_ + ", " + this.y_ + ", " + this.z_ + ")";
}

Vector.prototype.set = function(x, y, z) {
  this.x_ = x;
  this.y_ = y;
  this.z_ = z;
}

Vector.prototype.plus = function(other) {
  return new Vector(this.x_ + other.x_, this.y_ + other.y_, this.z_ + other.z_);
}

Vector.prototype.minus = function(other) {
  return this.plus(other.scale(-1));
}

Vector.prototype.length = function() {
  return Math.sqrt(this.x_ * this.x_ + this.y_ * this.y_ + this.z_ * this.z_);
}

Vector.prototype.scale = function(scale) {
  return new Vector(this.x_ * scale, this.y_ * scale, this.z_ * scale);
}

Vector.prototype.unitVector = function() {
  return this.scale(1 / this.length());
}

Vector.prototype.dot = function(other) {
  return this.x_ * other.x_ + this.y_ * other.y_ + this.z_ * other.z_;
}

/*
Vector.prototype.cross = function(other) {
  return new Vector(this.y_ * other.z_ - this.z_ * other.y_,
                    this.z_ * other.x_ - this.x_ * other.z_,
                    this.x_ * other.y_ - this.y_ * other.x_);
}
*/

Vector.prototype.componentOutOfPlane = function(plane) {
  var n = plane.getUnitNormal();
  var magnitude = this.dot(n);
  return n.scale(magnitude);
}

/*
Vector.prototype.componentInPlane = function(plane) {
  // TODO: Better to just subtract component out of plane?
  var n = plane.getUnitNormal();
  var perpendicular = this.cross(n);
  return n.cross(perpendicular);
}
*/


function Plane(normal) {
  this.unitNormal_ = normal.unitVector();
}

Plane.prototype.getUnitNormal = function() {
  return this.unitNormal_;
}


function Particle(position, mass) {
  this.position_ = position;
  this.mass_ = mass;
  this.velocity_ = new Vector(0, 0, 0);
  this.springs_ = [];
}

Particle.prototype.position = function() {
  return this.position_();
}

Particle.prototype.addSpring = function(spring) {
  return this.springs_.push(spring);
}

Particle.prototype.cacheTotalSpringForce = function() {
  this.cachedTotalStringForce_ = this.totalSpringForce();
}

Particle.prototype.unCacheTotalSpringForce = function() {
  this.cachedTotalStringForce_ = undefined;
}

Particle.prototype.totalSpringForce = function() {
  if (this.cachedTotalSpringForce_ !== undefined) {
    return this.cachedTotalSpringForce_;
  }
  return this.springs_.reduce(function(previous, current) {
    return previous.forceOn(this).plus(current.forceOn(this));
  }.bind(this);
}

Particle.prototype.step = function(additionalForce, dt) {
  var totalForce = this.totalSpringForce().plus(additionalForce);
  var acceleration = totalForce.scale(1 / mass);
  return this.position_ + this.veclocity_.scale(dt) + acceleration.scale(dt * dt / 2);
}


function Spring(naturalLength, stiffness, particle1, particle2) {
  this.naturalLength_ = naturalLength;
  this.stiffness_ = stiffness;
  this.particle1_ = particle1;
  this.particle2_ = particle2;
  this.particle1_.addSpring(this);
  this.particle2_.addSpring(this);
}

Spring.prototype.forceOn = function(particle) {
  console.assert(particle === this.particle1_ || particle === this.particle2_);
  var end2RelativeToEnd1 = this.particle2_.position().minus(this.particle1_.position());
  // Compression is positive.
  var magnitude = (this.naturalLength_ - end2RelativeToEnd1.length()) * this.stiffness_;
  var forceOnEnd2 = end2RelativeToEnd1.unitVector().scale(magnitude);
  return particle === this.particle2_ ? forceOnEnd2 : forceOnEnd2.scale(-1);
}


  var naturalLength = 2 * radius;
  var stiffness = 1;
  for (var i = 0; i < particles.length; ++i) {
    for (var j = i + 1; j < particles.length; ++j) {
      new Spring(naturalLength, stiffness, particles[i], [articles[j]);
    }
  }

  particles.forEach(function(particle) {
    particle.cacheTotalSpringForce();
  });

  particles.forEach(function(particle) {
    particle.cacheTotalSpringForce();
  });
