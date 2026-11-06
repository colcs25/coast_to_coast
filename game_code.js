// =============================================================================
// COAST-TO-COAST USA RALLY — Complete MakeCode Arcade Game
// Fixed Stage Completion, Guaranteed Finish Line Crossing & Full HUD
// =============================================================================
// Controls:
//   - D-Pad / Arrow Keys : Steer, Accelerate, and Brake
//   - A Button (Space / Z) : Trigger Nitro Boost
//   - B Button (X)         : Quick Brake / Drift
// =============================================================================

namespace SpriteKind {
    export const Obstacle = SpriteKind.create();
    export const ShoulderHazard = SpriteKind.create();
    export const Pickup = SpriteKind.create();
    export const TrafficCar = SpriteKind.create();
    export const FinishLine = SpriteKind.create();
}

interface StageData {
    name: string;
    location: string;
    vehicleName: string;
    targetSeconds: number;
    bgColor: number;
    roadColor: number;
    shoulderColor: number;
    stripeColor: number;
    speedBonus: number;
    trafficRateMs: number;
    curveMax: number;
    isOffroad: boolean;
    hazardType: string;
}

const STAGES: StageData[] = [
    {
        name: "Stage 1: Pacific Coast Highway",
        location: "California Cliffs",
        vehicleName: "F1 Apex Speeder",
        targetSeconds: 40,
        bgColor: 9,          // Ocean blue
        roadColor: 13,        // Dark asphalt
        shoulderColor: 7,     // Green grass
        stripeColor: 1,       // White stripes
        speedBonus: 1.25,
        trafficRateMs: 900,
        curveMax: 50,
        isOffroad: false,
        hazardType: "oil"
    },
    {
        name: "Stage 2: Mojave Canyon Trail",
        location: "Nevada Dirt Gorge",
        vehicleName: "4x4 Desert Trophy Truck",
        targetSeconds: 45,
        bgColor: 4,          // Orange canyon rock
        roadColor: 14,        // Dark brown dirt trail
        shoulderColor: 15,    // Desert sand
        stripeColor: 4,       // Sand grooves
        speedBonus: 1.0,
        trafficRateMs: 1100,
        curveMax: 65,
        isOffroad: true,
        hazardType: "mud"
    },
    {
        name: "Stage 3: Heartland Interstate 80",
        location: "Midwest Highway",
        vehicleName: "Heavy Hauler Semi-Rig",
        targetSeconds: 50,
        bgColor: 7,          // Prairie green
        roadColor: 12,        // Concrete grey
        shoulderColor: 6,     // Dirt gravel
        stripeColor: 5,       // Yellow dividers
        speedBonus: 1.05,
        trafficRateMs: 650,
        curveMax: 35,
        isOffroad: false,
        hazardType: "barrier"
    },
    {
        name: "Stage 4: Broadway Metro Dash",
        location: "New York City Sprint",
        vehicleName: "Twin-Turbo GT Racer",
        targetSeconds: 35,
        bgColor: 15,         // Night black
        roadColor: 11,        // Night tarmac
        shoulderColor: 12,    // Concrete sidewalk
        stripeColor: 1,       // Bright neon white
        speedBonus: 1.35,
        trafficRateMs: 500,
        curveMax: 55,
        isOffroad: false,
        hazardType: "traffic"
    }
];

// -----------------------------------------------------------------------------
// SPRITE PIXEL ART
// -----------------------------------------------------------------------------

// Vehicle 1: F1 Speeder
const SPRITE_F1 = img`
    . . . . . 2 2 2 . . . . .
    . . . . 2 2 2 2 2 . . . .
    . . . . 2 1 1 1 2 . . . .
    . . f f 2 1 f 1 2 f f . .
    . . f f 2 2 2 2 2 f f . .
    . . . . 2 2 2 2 2 . . . .
    . . . 2 2 8 8 8 2 2 . . .
    . . . 2 8 8 8 8 8 2 . . .
    . . . 2 8 f f f 8 2 . . .
    . . . 2 8 8 8 8 8 2 . . .
    . . f f 2 2 2 2 2 f f . .
    . . f f 2 2 2 2 2 f f . .
    . . f f 2 2 2 2 2 f f . .
    . . . . 2 2 2 2 2 . . . .
    . . 2 2 2 2 2 2 2 2 2 . .
    . . 2 2 . . . . . 2 2 . .
`;

// Vehicle 2: 4x4 Trophy Truck
const SPRITE_TRUCK = img`
    . . f f . . . . . f f . .
    . . f f 4 4 4 4 4 f f . .
    . . . 4 4 4 4 4 4 4 . . .
    . . 4 4 1 1 1 1 1 4 4 . .
    . . 4 1 1 1 1 1 1 1 4 . .
    . . 4 1 f f f f f 1 4 . .
    . . 4 4 1 1 1 1 1 4 4 . .
    . . 4 4 4 4 4 4 4 4 4 . .
    . . 4 4 e e e e e 4 4 . .
    . . 4 4 e e e e e 4 4 . .
    . . f f 4 4 4 4 4 f f . .
    . . f f 4 4 4 4 4 f f . .
    . . f f 4 4 4 4 4 f f . .
    . . . 4 4 4 4 4 4 4 . . .
    . . . 4 . . . . . 4 . . .
    . . . . . . . . . . . . .
`;

// Vehicle 3: Semi-Rig
const SPRITE_SEMI = img`
    . . . 5 5 5 5 5 5 5 . . .
    . . . 5 1 1 1 1 1 5 . . .
    . . . 5 1 f f f 1 5 . . .
    . . f 5 5 5 5 5 5 5 f . .
    . . f d d d d d d d f . .
    . . . d d d d d d d . . .
    . . . d d d d d d d . . .
    . . . d d d d d d d . . .
    . . . d d d d d d d . . .
    . . . d d d d d d d . . .
    . . f d d d d d d d f . .
    . . f d d d d d d d f . .
    . . f d d d d d d d f . .
    . . . d d d d d d d . . .
    . . f d d d d d d d f . .
    . . f f f f f f f f f . .
`;

// Vehicle 4: Twin-Turbo GT
const SPRITE_GT = img`
    . . . . 8 8 8 8 8 . . . .
    . . . 8 8 8 8 8 8 8 . . .
    . . . 8 1 1 1 1 1 8 . . .
    . . f 8 1 1 1 1 1 8 f . .
    . . f 8 1 f f f 1 8 f . .
    . . . 8 8 1 1 1 8 8 . . .
    . . . 8 8 8 8 8 8 8 . . .
    . . . 8 8 7 7 7 8 8 . . .
    . . . 8 8 7 7 7 8 8 . . .
    . . . 8 8 8 8 8 8 8 . . .
    . . f 8 8 8 8 8 8 8 f . .
    . . f 8 8 8 8 8 8 8 f . .
    . . f 8 8 8 8 8 8 8 f . .
    . . . 8 8 8 8 8 8 8 . . .
    . . . 9 9 9 9 9 9 9 . . .
    . . . 9 . . . . . 9 . . .
`;

// Traffic Sprites
const SPRITE_TRAFFIC_RED = img`
    . . . . 2 2 2 2 . . . . .
    . . . 2 2 2 2 2 2 . . . .
    . . . 2 1 1 1 1 2 . . . .
    . . f 2 1 1 1 1 2 f . . .
    . . f 2 2 2 2 2 2 f . . .
    . . . 2 2 2 2 2 2 . . . .
    . . . 2 2 2 2 2 2 . . . .
    . . . 2 2 2 2 2 2 . . . .
    . . f 2 2 2 2 2 2 f . . .
    . . f 2 2 2 2 2 2 f . . .
    . . . . 2 2 2 2 . . . . .
`;

const SPRITE_TRAFFIC_TEAL = img`
    . . . . 6 6 6 6 . . . . .
    . . . 6 6 6 6 6 6 . . . .
    . . . 6 1 1 1 1 6 . . . .
    . . f 6 1 1 1 1 6 f . . .
    . . f 6 6 6 6 6 6 f . . .
    . . . 6 6 6 6 6 6 . . . .
    . . . 6 6 6 6 6 6 . . . .
    . . . 6 6 6 6 6 6 . . . .
    . . f 6 6 6 6 6 6 f . . .
    . . f 6 6 6 6 6 6 f . . .
    . . . . 6 6 6 6 . . . . .
`;

const SPRITE_TRAFFIC_PURPLE = img`
    . . . . a a a a . . . . .
    . . . a a a a a a . . . .
    . . . a 1 1 1 1 a . . . .
    . . f a 1 1 1 1 a f . . .
    . . f a a a a a a f . . .
    . . . a a a a a a . . . .
    . . . a a a a a a . . . .
    . . . a a a a a a . . . .
    . . f a a a a a a f . . .
    . . f a a a a a a f . . .
    . . . . a a a a . . . . .
`;

const SPRITE_TRAFFIC_YELLOW = img`
    . . . . 5 5 5 5 . . . . .
    . . . 5 5 5 5 5 5 . . . .
    . . . 5 1 1 1 1 5 . . . .
    . . f 5 1 1 1 1 5 f . . .
    . . f 5 5 5 5 5 5 f . . .
    . . . 5 5 5 5 5 5 . . . .
    . . . 5 5 5 5 5 5 . . . .
    . . . 5 5 5 5 5 5 . . . .
    . . f 5 5 5 5 5 5 f . . .
    . . f 5 5 5 5 5 5 f . . .
    . . . . 5 5 5 5 . . . . .
`;

// Pickups
const SPRITE_NITRO = img`
    . . . . 1 1 1 . . . .
    . . . 1 9 9 9 1 . . .
    . . . 1 9 8 9 1 . . .
    . . . 1 8 8 8 1 . . .
    . . . 1 8 5 8 1 . . .
    . . . 1 5 5 5 1 . . .
    . . . 1 5 4 5 1 . . .
    . . . 1 4 4 4 1 . . .
    . . . . 1 1 1 . . . .
`;

const SPRITE_STAR = img`
    . . . . . 5 5 . . . . .
    . . . . 5 5 5 5 . . . .
    . . 5 5 5 5 5 5 5 5 . .
    . . . 5 5 5 5 5 5 . . .
    . . . . 5 5 5 5 . . . .
    . . . 5 5 5 5 5 5 . . .
    . . 5 5 5 . . 5 5 5 . .
    . . 5 . . . . . . 5 . .
`;

const SPRITE_WRENCH = img`
    . . . . . . . 1 1 1 .
    . . . . . . 1 9 9 1 .
    . . . . . 1 9 . . . .
    . . . . 1 9 . . . . .
    . . . 1 9 . . . . . .
    . . 1 9 . . . . . . .
    . 1 9 1 . . . . . . .
    . 1 1 1 . . . . . . .
`;

// Hazards
const SPRITE_OIL = img`
    . . . . . f f f . . . .
    . . . f f f f f f . . .
    . f f f f f f f f f f .
    f f f f f f f f f f f f
    f f f f f f f f f f f f
    . f f f f f f f f f f .
    . . . f f f f f f . . .
    . . . . . f f f . . . .
`;

const SPRITE_MUD_BOG = img`
    . . . . e e e e . . . .
    . . e e e e e e e e . .
    . e e f f e e f f e e .
    e e f f f e f f f e e e
    e e f f f f f f f e e e
    . e e f f f f f e e e .
    . . e e e e e e e e . .
    . . . . e e e e . . . .
`;

const SPRITE_ROCK = img`
    . . . . d d d . . . .
    . . . d d c d d . . .
    . . d c c c c d d . .
    . d c b b b c c d . .
    . d c b b b b c d . .
    . d d c b b c d d . .
    . . d d c c d d . . .
    . . . . d d d . . . .
`;

const SPRITE_CACTUS = img`
    . . . . 7 7 . . . . .
    . . 7 . 7 7 . . . . .
    . . 7 . 7 7 . 7 . . .
    . . 7 7 7 7 . 7 . . .
    . . . 7 7 7 7 7 . . .
    . . . . 7 7 . 7 . . .
    . . . . 7 7 . . . . .
    . . . . 7 7 . . . . .
    . . . . 7 7 . . . . .
    . . . . 7 7 . . . . .
    . . . e e e e . . . .
`;

// Helper: Generates a full 100px-wide checkered finish banner image
function createFinishBannerImage(): Image {
    const banner = image.create(104, 10);
    for (let bx = 0; bx < 104; bx += 8) {
        for (let by = 0; by < 10; by += 5) {
            const isWhite = ((bx / 8) + (by / 5)) % 2 === 0;
            banner.fillRect(bx, by, 8, 5, isWhite ? 1 : 15);
        }
    }
    return banner;
}

const SPRITE_FINISH_IMG = createFinishBannerImage();

// -----------------------------------------------------------------------------
// GAME STATE
// -----------------------------------------------------------------------------

let currentStageIndex = 0;
let player: Sprite = null;
let finishLine: Sprite = null;

let stageDistance = 0;
const STAGE_MAX_DISTANCE = 900;
let stageStartTime = 0;
let totalRaceTime = 0;

let currentSpeed = 0;
let nitroBoostActive = false;
let nitroFuel = 100;
const MAX_NITRO = 100;

// High-Curvature Road Math
let roadWidth = 92;
let roadCenterBase = 80;
let roadCurveCurrent = 0;
let roadCurveTarget = 0;
let nextTurnChangeTime = 0;

let isStageTransitioning = false;
let isGameOver = false;

// Perspective Road Curvature
function getRoadCenterAtY(y: number): number {
    const norm = Math.clamp(0, 1, (120 - y) / 120);
    return roadCenterBase + (roadCurveCurrent * Math.pow(norm, 1.45));
}

function getStageVehicleSprite(stageIdx: number): Image {
    switch (stageIdx) {
        case 0: return SPRITE_F1;
        case 1: return SPRITE_TRUCK;
        case 2: return SPRITE_SEMI;
        case 3: return SPRITE_GT;
        default: return SPRITE_F1;
    }
}

function getRandomTrafficSprite(): Image {
    const choice = Math.randomRange(0, 3);
    if (choice === 0) return SPRITE_TRAFFIC_RED;
    if (choice === 1) return SPRITE_TRAFFIC_TEAL;
    if (choice === 2) return SPRITE_TRAFFIC_PURPLE;
    return SPRITE_TRAFFIC_YELLOW;
}

// -----------------------------------------------------------------------------
// INITIALIZATION
// -----------------------------------------------------------------------------

function showIntroScreen() {
    game.splash("COAST TO COAST", "USA Grand Rally");
    game.showLongText(
        "RACE ACROSS AMERICA!\n\n" +
        "• D-PAD: Steer & Throttle\n" +
        "• [A] Button: Nitro Boost\n" +
        "• [B] Button: Quick Brake\n\n" +
        "Cross the checkered line\n" +
        "under the target time to win!",
        DialogLayout.Center
    );
}

function startStage(stageIdx: number) {
    currentStageIndex = stageIdx;
    const stage = STAGES[currentStageIndex];

    isStageTransitioning = true;
    stageDistance = 0;
    currentSpeed = 65;
    nitroFuel = 80;
    roadCurveCurrent = 0;
    roadCurveTarget = 0;
    nextTurnChangeTime = game.runtime() + 2000;

    // Destroy and reset all active sprites
    for (const s of sprites.allOfKind(SpriteKind.Obstacle)) s.destroy();
    for (const s of sprites.allOfKind(SpriteKind.ShoulderHazard)) s.destroy();
    for (const s of sprites.allOfKind(SpriteKind.Pickup)) s.destroy();
    for (const s of sprites.allOfKind(SpriteKind.TrafficCar)) s.destroy();
    for (const s of sprites.allOfKind(SpriteKind.FinishLine)) s.destroy();
    finishLine = null;

    scene.setBackgroundColor(stage.bgColor);

    music.playTone(523, music.beat(BeatFraction.Quarter));
    music.playTone(659, music.beat(BeatFraction.Quarter));
    music.playTone(784, music.beat(BeatFraction.Half));

    game.splash(stage.name, "Target: " + stage.targetSeconds + "s | Vehicle: " + stage.vehicleName);

    if (!player) {
        player = sprites.create(getStageVehicleSprite(stageIdx), SpriteKind.Player);
        player.setStayInScreen(false);
    } else {
        player.setImage(getStageVehicleSprite(stageIdx));
    }

    player.setPosition(80, 100);
    player.z = 10;

    stageStartTime = game.runtime();
    isStageTransitioning = false;
}

// -----------------------------------------------------------------------------
// CONTROLS
// -----------------------------------------------------------------------------

controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (nitroFuel > 15 && !nitroBoostActive && !isStageTransitioning && !isGameOver && player) {
        nitroBoostActive = true;
        music.playTone(880, music.beat(BeatFraction.Eighth));
        music.playTone(1047, music.beat(BeatFraction.Quarter));
        player.startEffect(effects.fire, 600);
    }
});

controller.A.onEvent(ControllerButtonEvent.Released, function () {
    nitroBoostActive = false;
});

controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (currentSpeed > 30 && player) {
        currentSpeed = Math.max(25, currentSpeed - 40);
        music.playTone(200, music.beat(BeatFraction.Sixteenth));
        player.startEffect(effects.spray, 200);
    }
});

// -----------------------------------------------------------------------------
// SPAWNING LOOPS
// -----------------------------------------------------------------------------

// Traffic Cars
game.onUpdateInterval(750, function () {
    if (isStageTransitioning || isGameOver || stageDistance >= STAGE_MAX_DISTANCE - 100) return;

    if (Math.percentChance(25)) return;

    const traffic = sprites.create(getRandomTrafficSprite(), SpriteKind.TrafficCar);
    const laneOffset = Math.randomRange(-28, 28);
    const topCenter = getRoadCenterAtY(0);
    traffic.setPosition(Math.clamp(16, 144, topCenter + laneOffset), 0);
    traffic.z = 5;
    traffic.vx = 0;
});

// Traffic Lane Changing
game.onUpdateInterval(1200, function () {
    if (isStageTransitioning || isGameOver) return;

    for (const car of sprites.allOfKind(SpriteKind.TrafficCar)) {
        if (car.y > 15 && car.y < 80 && Math.percentChance(40)) {
            const dir = Math.percentChance(50) ? 1 : -1;
            car.vx = dir * Math.randomRange(15, 30);
        }
    }
});

// Road Hazards
game.onUpdateInterval(1400, function () {
    if (isStageTransitioning || isGameOver || stageDistance >= STAGE_MAX_DISTANCE - 80) return;

    const stage = STAGES[currentStageIndex];
    let hazardImg = SPRITE_OIL;

    if (stage.isOffroad) {
        hazardImg = Math.percentChance(60) ? SPRITE_MUD_BOG : SPRITE_ROCK;
    } else if (stage.hazardType === "rock" || stage.hazardType === "barrier") {
        hazardImg = SPRITE_ROCK;
    }

    const obs = sprites.create(hazardImg, SpriteKind.Obstacle);
    const topCenter = getRoadCenterAtY(0);
    const spawnX = Math.clamp(20, 140, topCenter + Math.randomRange(-26, 26));
    obs.setPosition(spawnX, 0);
    obs.z = 4;
});

// Off-Road Shoulder Obstacles (Cacti / Boulders)
game.onUpdateInterval(1100, function () {
    if (isStageTransitioning || isGameOver || stageDistance >= STAGE_MAX_DISTANCE - 80) return;

    const stage = STAGES[currentStageIndex];
    const topCenter = getRoadCenterAtY(0);
    const halfW = roadWidth / 2;

    const onLeft = Math.percentChance(50);
    let shoulderX = 0;
    if (onLeft) {
        shoulderX = topCenter - halfW - Math.randomRange(6, 18);
    } else {
        shoulderX = topCenter + halfW + Math.randomRange(6, 18);
    }

    if (shoulderX > 4 && shoulderX < 156) {
        const itemImg = stage.isOffroad ? (Math.percentChance(50) ? SPRITE_CACTUS : SPRITE_ROCK) : SPRITE_ROCK;
        const shoulderHazard = sprites.create(itemImg, SpriteKind.ShoulderHazard);
        shoulderHazard.setPosition(shoulderX, 0);
        shoulderHazard.z = 4;
    }
});

// Pickups (Nitro, Stars, Wrenches)
game.onUpdateInterval(1800, function () {
    if (isStageTransitioning || isGameOver || stageDistance >= STAGE_MAX_DISTANCE - 80) return;

    let pImg = SPRITE_NITRO;
    if (Math.percentChance(45)) {
        pImg = SPRITE_NITRO;
    } else if (Math.percentChance(35)) {
        pImg = SPRITE_STAR;
    } else {
        pImg = SPRITE_WRENCH;
    }

    const pickup = sprites.create(pImg, SpriteKind.Pickup);
    const topCenter = getRoadCenterAtY(0);
    pickup.setPosition(Math.clamp(20, 140, topCenter + Math.randomRange(-28, 28)), 0);
    pickup.z = 4;
});

// -----------------------------------------------------------------------------
// COLLISION & OVERLAPS
// -----------------------------------------------------------------------------

// On-road obstacle hit (Oil, Rocks, Mud)
sprites.onOverlap(SpriteKind.Player, SpriteKind.Obstacle, function (p: Sprite, obs: Sprite) {
    const img = obs.image;
    obs.destroy();

    if (img === SPRITE_MUD_BOG) {
        music.playTone(180, music.beat(BeatFraction.Quarter));
        currentSpeed = Math.max(20, currentSpeed * 0.4);
        p.startEffect(effects.spray, 300);
    } else {
        music.playTone(160, music.beat(BeatFraction.Quarter));
        scene.cameraShake(4, 300);
        currentSpeed = Math.max(25, currentSpeed * 0.5);
        info.changeLifeBy(-1);
        p.startEffect(effects.disintegrate, 400);

        if (info.life() <= 0) {
            handleGameOver(false, "Wrecked out on road hazard!");
        }
    }
});

// Off-road shoulder hazard collision (Cactus / Shoulder Rock)
sprites.onOverlap(SpriteKind.Player, SpriteKind.ShoulderHazard, function (p: Sprite, hazard: Sprite) {
    hazard.destroy();
    music.playTone(140, music.beat(BeatFraction.Quarter));
    scene.cameraShake(5, 350);
    currentSpeed = Math.max(15, currentSpeed * 0.35);
    info.changeLifeBy(-1);
    p.startEffect(effects.disintegrate, 400);

    if (info.life() <= 0) {
        handleGameOver(false, "Crashed into off-road terrain!");
    }
});

// Crash into civilian traffic
sprites.onOverlap(SpriteKind.Player, SpriteKind.TrafficCar, function (p: Sprite, car: Sprite) {
    car.destroy(effects.fire, 300);
    music.playTone(130, music.beat(BeatFraction.Half));
    scene.cameraShake(6, 400);
    currentSpeed = 20;
    info.changeLifeBy(-1);

    if (info.life() <= 0) {
        handleGameOver(false, "Highway traffic crash!");
    }
});

// Collect pickups
sprites.onOverlap(SpriteKind.Player, SpriteKind.Pickup, function (p: Sprite, item: Sprite) {
    const itemImg = item.image;
    item.destroy();

    if (itemImg === SPRITE_NITRO) {
        nitroFuel = Math.min(MAX_NITRO, nitroFuel + 45);
        info.changeScoreBy(150);
        music.playTone(600, music.beat(BeatFraction.Eighth));
        music.playTone(900, music.beat(BeatFraction.Eighth));
    } else if (itemImg === SPRITE_STAR) {
        info.changeScoreBy(500);
        music.playTone(784, music.beat(BeatFraction.Quarter));
    } else if (itemImg === SPRITE_WRENCH) {
        if (info.life() < 3) {
            info.changeLifeBy(1);
            music.playTone(440, music.beat(BeatFraction.Quarter));
        } else {
            info.changeScoreBy(250);
        }
    }
});

// Finish line sprite collision
sprites.onOverlap(SpriteKind.Player, SpriteKind.FinishLine, function (p: Sprite, finish: Sprite) {
    finish.destroy();
    finishLine = null;
    completeStage();
});

// -----------------------------------------------------------------------------
// STAGE PROGRESSION
// -----------------------------------------------------------------------------

function completeStage() {
    if (isStageTransitioning || isGameOver) return;
    isStageTransitioning = true;

    const stage = STAGES[currentStageIndex];
    const stageDurationSec = Math.floor((game.runtime() - stageStartTime) / 1000);
    totalRaceTime += stageDurationSec;

    // Victory sounds
    music.playTone(523, music.beat(BeatFraction.Quarter));
    music.playTone(659, music.beat(BeatFraction.Quarter));
    music.playTone(784, music.beat(BeatFraction.Quarter));
    music.playTone(1046, music.beat(BeatFraction.Half));

    const beatTarget = stageDurationSec <= stage.targetSeconds;
    let bonus = 1000;
    if (beatTarget) {
        const diff = stage.targetSeconds - stageDurationSec;
        bonus += diff * 150;
    }
    info.changeScoreBy(bonus);

    game.splash(
        stage.name + " CLEAR!",
        "Time: " + stageDurationSec + "s (Target: " + stage.targetSeconds + "s)\n" +
        (beatTarget ? "★ BEAT TARGET! +" : "Finished! +") + bonus + " PTS"
    );

    if (currentStageIndex < STAGES.length - 1) {
        startStage(currentStageIndex + 1);
    } else {
        handleGameOver(true, "COAST TO COAST CHAMPION!\nTotal Time: " + totalRaceTime + "s");
    }
}

function handleGameOver(won: boolean, msg: string) {
    isGameOver = true;
    if (won) {
        music.playTone(523, music.beat(BeatFraction.Eighth));
        music.playTone(659, music.beat(BeatFraction.Eighth));
        music.playTone(784, music.beat(BeatFraction.Eighth));
        music.playTone(1046, music.beat(BeatFraction.Whole));
        game.over(true, effects.confetti);
    } else {
        music.playTone(300, music.beat(BeatFraction.Quarter));
        music.playTone(200, music.beat(BeatFraction.Quarter));
        music.playTone(100, music.beat(BeatFraction.Whole));
        game.setGameOverMessage(false, msg);
        game.over(false, effects.dissolve);
    }
}

// -----------------------------------------------------------------------------
// MAIN GAME LOOP & PHYSICS
// -----------------------------------------------------------------------------

let roadStripeOffset = 0;

game.onUpdate(function () {
    if (isStageTransitioning || isGameOver || !player) return;

    const stage = STAGES[currentStageIndex];

    // 1. Dynamic Road Turns
    if (game.runtime() > nextTurnChangeTime) {
        const maxBend = stage.curveMax;
        const targetDirection = Math.percentChance(50) ? 1 : -1;
        roadCurveTarget = targetDirection * Math.randomRange(maxBend * 0.6, maxBend);
        nextTurnChangeTime = game.runtime() + Math.randomRange(2200, 4200);
    }

    roadCurveCurrent = roadCurveCurrent + (roadCurveTarget - roadCurveCurrent) * 0.04;

    // 2. Throttle / Speed
    let targetSpeed = 80 * stage.speedBonus;
    if (controller.up.isPressed()) {
        targetSpeed = 120 * stage.speedBonus;
    } else if (controller.down.isPressed()) {
        targetSpeed = 40;
    }

    // Nitro
    if (nitroBoostActive && nitroFuel > 0) {
        targetSpeed = 175 * stage.speedBonus;
        nitroFuel = Math.max(0, nitroFuel - 0.7);
        player.startEffect(effects.fire, 100);
        if (nitroFuel <= 0) {
            nitroBoostActive = false;
        }
    } else if (!nitroBoostActive && nitroFuel < MAX_NITRO) {
        nitroFuel = Math.min(MAX_NITRO, nitroFuel + 0.08);
    }

    currentSpeed = currentSpeed + (targetSpeed - currentSpeed) * 0.08;

    // 3. Steering & Centripetal Pull
    let lateralSpeed = 0;
    if (controller.left.isPressed()) {
        lateralSpeed = -85;
    } else if (controller.right.isPressed()) {
        lateralSpeed = 85;
    }

    const centrifugalForce = -(roadCurveCurrent * 0.65) * (currentSpeed / 80);
    player.vx = lateralSpeed + centrifugalForce;

    // 4. Off-Road Shoulder Check
    const playerRoadCenter = getRoadCenterAtY(player.y);
    const roadLeft = playerRoadCenter - (roadWidth / 2);
    const roadRight = playerRoadCenter + (roadWidth / 2);

    if (player.x < roadLeft || player.x > roadRight) {
        currentSpeed = Math.max(25, currentSpeed * 0.92);
        player.startEffect(effects.spray, 50);
    }

    player.x = Math.clamp(10, 150, player.x);
    player.y = 100;

    // 5. Distance & Spawn Finish Banner
    stageDistance += (currentSpeed / 60);

    if (stageDistance >= STAGE_MAX_DISTANCE && !finishLine) {
        finishLine = sprites.create(SPRITE_FINISH_IMG, SpriteKind.FinishLine);
        finishLine.setPosition(getRoadCenterAtY(0), -8);
        finishLine.vy = currentSpeed;
        finishLine.z = 2;
    }

    // 6. Manual Offscreen Cleanup & Parallax
    for (const obs of sprites.allOfKind(SpriteKind.Obstacle)) {
        obs.vy = currentSpeed;
        obs.x += -(roadCurveCurrent * 0.035);
        if (obs.y > 130) obs.destroy();
    }

    for (const sh of sprites.allOfKind(SpriteKind.ShoulderHazard)) {
        sh.vy = currentSpeed;
        sh.x += -(roadCurveCurrent * 0.035);
        if (sh.y > 130) sh.destroy();
    }

    for (const p of sprites.allOfKind(SpriteKind.Pickup)) {
        p.vy = currentSpeed;
        p.x += -(roadCurveCurrent * 0.035);
        if (p.y > 130) p.destroy();
    }

    for (const car of sprites.allOfKind(SpriteKind.TrafficCar)) {
        car.vy = Math.max(20, currentSpeed - 35);
        car.x += -(roadCurveCurrent * 0.035) + (car.vx * 0.02);
        if (car.y > 130 || car.y < -20) car.destroy();
    }

    // Fail-Safe Finish Line Crossing Check
    if (finishLine) {
        finishLine.vy = currentSpeed;
        finishLine.x += -(roadCurveCurrent * 0.035);

        // When finish line crosses the player's Y level (100)
        if (finishLine.y >= player.y - 4) {
            finishLine.destroy();
            finishLine = null;
            completeStage();
            return;
        }
    }

    roadStripeOffset = (roadStripeOffset + (currentSpeed * 0.12)) % 24;
    info.changeScoreBy(Math.floor(currentSpeed * 0.015));
});

// -----------------------------------------------------------------------------
// DYNAMIC ROAD RENDERING & LIVE HUD WITH TIMER
// -----------------------------------------------------------------------------

scene.createRenderable(0, function (target: Image, camera: scene.Camera) {
    const stage = STAGES[currentStageIndex];

    // 1. Draw Road Surface
    for (let y = 0; y < 120; y += 2) {
        const center = getRoadCenterAtY(y);
        const halfW = roadWidth / 2;

        // Shoulder gravel / dirt
        target.fillRect(center - halfW - 6, y, roadWidth + 12, 2, stage.shoulderColor);

        // Road Surface
        target.fillRect(center - halfW, y, roadWidth, 2, stage.roadColor);

        // Curbs
        target.fillRect(center - halfW - 2, y, 2, 2, 1);
        target.fillRect(center + halfW, y, 2, 2, 1);
    }

    // 2. Dashed Lane Markings
    for (let y = -24 + roadStripeOffset; y < 120; y += 24) {
        if (y >= 0 && y < 118) {
            const center = getRoadCenterAtY(y);
            target.fillRect(center - 1, y, 2, 12, stage.stripeColor);
            target.fillRect(center - 24, y, 1, 8, stage.stripeColor);
            target.fillRect(center + 24, y, 1, 8, stage.stripeColor);
        }
    }

    // 3. TOP HUD: LIVE TIMER & TARGET TIME
    const elapsedMs = isStageTransitioning ? 0 : Math.max(0, game.runtime() - stageStartTime);
    const elapsedTenths = Math.floor(elapsedMs / 100);
    const sec = Math.floor(elapsedTenths / 10);
    const dec = elapsedTenths % 10;
    const timeStr = "" + sec + "." + dec + "s";

    let timerColor = 1;
    if (sec > stage.targetSeconds) {
        timerColor = 2; // Red warning
    } else if (sec >= stage.targetSeconds - 5) {
        timerColor = 5; // Yellow caution
    }

    // Background pill for Timer
    target.fillRect(2, 2, 54, 10, 15);
    target.print(timeStr, 6, 3, timerColor);

    // Target Time pill on top right
    target.fillRect(116, 2, 42, 10, 15);
    target.print("T:" + stage.targetSeconds + "s", 120, 3, 5);

    // 4. TOP CENTER: STAGE DISTANCE PROGRESS BAR
    const barWidth = 52;
    const barX = 60;
    const barY = 5;
    target.fillRect(barX - 1, barY - 1, barWidth + 2, 5, 15);
    const progress = Math.clamp(0, 1, stageDistance / STAGE_MAX_DISTANCE);
    target.fillRect(barX, barY, Math.floor(barWidth * progress), 3, 7);

    // 5. BOTTOM HUD: SPEEDOMETER & NITRO GAUGE
    const nitroW = 32;
    const nitroX = 120;
    const nitroY = 112;
    target.fillRect(nitroX - 1, nitroY - 1, nitroW + 2, 6, 15);
    const nitroFill = Math.floor(nitroW * (nitroFuel / MAX_NITRO));
    target.fillRect(nitroX, nitroY, nitroFill, 4, nitroFuel > 25 ? 9 : 2);

    target.fillRect(2, 110, 48, 9, 15);
    target.print(Math.floor(currentSpeed) + " MPH", 4, 111, 1);
    target.print("N2O", 98, 112, 9);
});

// -----------------------------------------------------------------------------
// GAME START
// -----------------------------------------------------------------------------

info.setLife(3);
info.setScore(0);
showIntroScreen();
startStage(0);