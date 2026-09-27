import { checkBounds, moveParticle, getParticle, setParticle } from "./canvas.js";
import { getRandomInt } from "./util.js";

/**
 * Base particle class
 */
class Particle {
    constructor() {
        this.color = "";
        this.type = "";
    }

    /**
     * Returns true if the particle should swap with other when trying
     * to move onto the same grid location as {@link other}.
     * 
     * EX: Let sand sink below water
     * 
     * @param {Particle} other 
     * @returns {boolean} Should the particle swap
     */
    swap(other) {
        return false;
    }

    /**
     * Update the particle at location (row, col)
     * 
     * @param {number} row 
     * @param {number} col 
     */
    update(row, col) {

    }
}

/**
 * Sand particle
 */
export class Sand extends Particle {
    constructor() {
        super();
        this.color = "orange";
        this.type = "sand";
    }

    swap(other) {
        return other.type == "water";
    }

    update(row, col) {
        let newRow = row + 1;

        if (!moveParticle(row, col, newRow, col, this.swap)){
            if (!moveParticle(row, col, newRow, col + 1, this.swap)){
                moveParticle(row, col, newRow, col - 1, this.swap);
            }
        }
    }
}

/**
 * Create particle based on dropdown name
 * 
 * @param {string} value 
 * @returns 
 */
export function checkParticleType(value) {
    if (value == "Sand") {
        return new Sand();
    } else  if (value == "Water") {
        return new Water();
    } else if (value == "Stone") {
        return new Stone();
    } else if (value == "Dirt") {
        return new Dirt();
    } else if (value == "Fire") {
        return new Fire();
    } else if (value == "Wood") {
        return new Wood();
    } else if (value == "Steam") {
        return new Steam();
    }

    return null;
}

export class Water extends Particle {
    constructor() {
        super();
        this.color = "blue";
        this.type = "water";
    }

    update(row, col) {
        if (getParticle(row + 1, col)?.type == "dirt") {
            setParticle(row + 1, col, new Grass());
            setParticle(row, col, null);
            return;
        }

        if (getRandomInt(0, 2) && !getParticle(row + 1, col)) {
            moveParticle(row, col, row + 1, col, super.swap);
        }

        if (getRandomInt(0, 1) && !getParticle(row, col + 1)) {
            moveParticle(row, col, row, col + 1, super.swap);
        }
        else if (!getParticle(row, col - 1)) {
            moveParticle(row, col, row, col - 1, super.swap);
        }
    }
}

export class Stone extends Particle {
    constructor() {
        super();
        this.color = "gray";
        this.type = "stone";
    }
}

export class Dirt extends Sand {
    constructor() {
        super();
        this.color = "brown";
        this.type = "dirt";
    }
}

export class Grass extends Sand {
    constructor() {
        super();
        this.color = "green";
        this.type = "grass";
    }
}

export class Fire extends Particle {
    constructor() {
        super();
        this.color = "orange";
        this.type = "fire";

        this.duration = 0;
        this.maxDuration = getRandomInt(40, 100);
    }

    update(row, col) {
        this.duration++;

        if (this.duration >= this.maxDuration) {
            setParticle(row, col, null);
            return;
        }

        const neighbors = [
            [row + 1, col],
            [row - 1, col],
            [row, col + 1],
            [row, col - 1]
        ];

        for (const [r, c] of neighbors) {
            const particle = getParticle(r, c);

            if (!particle) {
                continue;
            }

            if (particle.type == "wood") {
                if (getRandomInt(0, 9) === 0) {
                    setParticle(r, c, new Fire());
                }
            }

            if (particle.type === "water") {
                if (getRandomInt(0, 19) === 0) {
                    setParticle(r, c, new Steam());
                    setParticle(row, col, null);
                    return;
                }
            }
        }

        if (!moveParticle(row, col, row - 1, col)) {
            if (!moveParticle(row, col, row - 1, col + 1)) {
                moveParticle(row, col, row - 1, col - 1);
            }
        }
    }
}

export class Wood extends Particle {
    constructor() {
        super();
        this.color = "#8B4513";
        this.type = "wood";
    }

    update(row, col) {
    }
}

export class Steam extends Particle {
    constructor() {
        super();
        this.color = "lightgray";
        this.type = "steam";
    }

    update(row, col) {
        if (getRandomInt(0, 999) === 0) {
            setParticle(row, col, null);
            return;
        }

        if (row === 0) {
            if (getRandomInt(0, 99) === 0) {
                setParticle(row, col, new Water());
                return;
            }
        }

        if (moveParticle(row, col, row - 1, col)) {
            return;
        }

        if (getRandomInt(0, 1) === 0) {
            if (moveParticle(row, col, row - 1, col + 1)) {
                return;
            }

            moveParticle(row, col, row - 1, col - 1);
        } else {
            if (moveParticle(row, col, row - 1, col - 1)) {
                return;
            }

            moveParticle(row, col, row - 1, col + 1);
        }
    }
}