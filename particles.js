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
        return other.type == "water";
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
        // TODO make sand fall under the water
    }

    update(row, col) {
        let newRow = row + 1;

        if (!moveParticle(row, col, newRow, col)){
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