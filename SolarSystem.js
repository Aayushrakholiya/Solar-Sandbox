/* 
 *  FILE          : SolarSystem.js
 *  PROJECT       : SENG-3040 – Assignment 3 (Solar System)
 *  PROGRAMMER    : Ayushkumar Rakholiya
 *  FIRST VERSION : 2025-11-12
 *  DESCRIPTION   :
 *    This file defines the SolarSystem class and encapsulates all 
 *    variables, constants, and drawing logic for a 3D solar system model 
 *    in p5.js.  
 */

//-------------------------------------------------------------
// CLASS : SolarSystem
// PURPOSE :
//   Encapsulates the entire simulation (stars, sun, planets) 
//   and provides setup(), draw(), and internal helper functions.
//-------------------------------------------------------------
class SolarSystem
{
    /*---------------------------------------------------------
     *  FUNCTION      : constructor
     *  DESCRIPTION   :
     *    Initializes constants, object properties, and random
     *    star positions.  The constructor does not depend on
     *    global variables; all state remains internal.
     *  PARAMETERS    : None
     *  RETURNS       : None
     *---------------------------------------------------------*/
    constructor()
    {
        // --- Constants (use uppercase, avoid magic numbers)
        this.CANVAS_SIZE = 700;
        this.DEFAULT_STAR_COUNT = 100;
        this.SUN_RADIUS = 30;
        this.EARTH_RADIUS = 15;
        this.MOON_RADIUS = 7;

        // Default Earth/Moon parameters
        this.defaultEarthDistance = 200;
        this.defaultEarthOrbitSpeed = 0.01;
        this.defaultEarthRotationSpeed = 0.03;

        this.defaultMoonDistance = 60;
        this.defaultMoonOrbitSpeed = 0.01;

        // --- initial state
        this.starCount = this.DEFAULT_STAR_COUNT;
        this.stars = [];

        this.earthTexture = null;
        this.moonTexture = null;

        this.earthDistance = this.defaultEarthDistance;
        this.earthOrbitSpeed = this.defaultEarthOrbitSpeed;
        this.earthRotationSpeed = this.defaultEarthRotationSpeed;

        this.earthOrbitAngle = 0;
        this.earthRotationAngle = 0;

        this.moonDistance = this.defaultMoonDistance;
        this.moonOrbitSpeed = this.defaultMoonOrbitSpeed;
        this.moonOrbitAngle = 0;

        // Earth & Moon radii
        this.earthRadius = this.EARTH_RADIUS;
        this.moonRadius = this.MOON_RADIUS;

        // Custom planets array
        this.customPlanets = [];

        // Pause button state
        this.paused = false;

        // --- UI references (initially null)
        this.starInput = null;

        this.earthDistanceSlider = null;
        this.earthDistanceLabel = null;
        this.earthSpeedSlider = null;
        this.earthSpeedLabel = null;

        this.moonDistanceSlider = null;
        this.moonDistanceLabel = null;
        this.moonSpeedSlider = null;
        this.moonSpeedLabel = null;

        this.planetSizeSlider = null;
        this.planetSizeLabel = null;
        this.planetDistanceLabel = null;
        this.planetDistanceSlider = null;
        this.planetSpeedLabel = null;
        this.planetSpeedSlider = null;
        this.planetRSlider = null;
        this.planetGSlider = null;
        this.planetBSlider = null;
        this.planetColourLabel = null;

        this.planetHasMoonCheckbox = null;
        this.planetMoonSizeSlider = null;
        this.planetMoonSizeLabel = null;
        this.planetMoonDistanceSlider = null;
        this.planetMoonDistanceLabel = null;
        this.planetMoonDistanceLabel = null;
        this.planetMoonSpeedLabel = null;

        this.createPlanetButton = null;
        this.removePlanetButton = null;

        this.pauseButton = null;
        this.resetButton = null;

        this.canvas = null;
        this.uiContainer = null;
    }

    /*---------------------------------------------------------
     *  FUNCTION      : preloadAssets
     *  DESCRIPTION   :
     *    Loads external image textures.  Called from the 
     *    p5.js preload() phase before setup() executes.
     *  PARAMETERS    : None
     *  RETURNS       : None
     *---------------------------------------------------------*/
    preloadAssets()
    {
        this.earthTexture = loadImage("assets/earth.jpg");
        this.moonTexture  = loadImage("assets/moon.jpg");
    }

    /*---------------------------------------------------------
     *  FUNCTION      : setup
     *  DESCRIPTION   :
     *    Creates the canvas, generates the starfield once, and
     *    sets drawing modes for texture rendering.
     *  PARAMETERS    : None
     *  RETURNS       : None
     *---------------------------------------------------------*/
    setup()
    {
        // Create canvas
        this.canvas = createCanvas(this.CANVAS_SIZE, this.CANVAS_SIZE, WEBGL);

        // Initial state and stars
        this.initDefaults();
        this.generateStars(this.starCount);

        // Create layout and UI
        this.setupUI();
    }

    /*---------------------------------------------------------
     *  FUNCTION      : update
     *  DESCRIPTION   :
     *    Updates simulation angles and any time-dependent 
     *    motion variables.
     *  PARAMETERS    : None
     *  RETURNS       : None
     *---------------------------------------------------------*/
    update()
    {
        if (!this.paused)
        {
            this.updateAngles();
        }
    }
    /*---------------------------------------------------------
     *  FUNCTION      : drawScene
     *  DESCRIPTION   :
     *    Renders the starfield, Sun, and Earth to the screen.
     *  PARAMETERS    : None
     *  RETURNS       : None
     *---------------------------------------------------------*/
    drawScene()
    {
        background(0);
        this.drawStars();
        this.drawSun();
        this.drawEarthAndMoon();
        this.drawCustomPlanets();
    }

    /*---------------------------------------------------------
     *  FUNCTION      : initDefaults
     *  DESCRIPTION   : 
     *      Initializes default values for simulation parameters.
     *  PARAMETERS    : None
     *  RETURNS       : None
     *---------------------------------------------------------*/
    initDefaults()
    {
        this.starCount = this.DEFAULT_STAR_COUNT;

        this.earthDistance = this.defaultEarthDistance;
        this.earthOrbitSpeed = this.defaultEarthOrbitSpeed;
        this.earthRotationSpeed = this.defaultEarthRotationSpeed;
        this.earthOrbitAngle = 0;
        this.earthRotationAngle = 0;

        this.moonDistance = this.defaultMoonDistance;
        this.moonOrbitSpeed = this.defaultMoonOrbitSpeed;
        this.moonOrbitAngle = 0;

        this.customPlanets = [];
        this.paused = false;
    }

    /*---------------------------------------------------------
     *  FUNCTION      : generateStars
     *  DESCRIPTION   : 
     *      Generates a starfield with the specified number of stars.
     *  PARAMETERS    : count - Number of stars to generate
     *  RETURNS       : None
     *---------------------------------------------------------*/
    generateStars(count)
    {
        this.stars = [];
        var i;

        // Generate static star positions
        for (i = 0; i < count; i++)
        {
            var x = random(-width / 2, width / 2);
            var y = random(-height / 2, height / 2);
            var z = random(-300, 300);
            this.stars.push({ x: x, y: y, z: z });
        }
    }

    /*---------------------------------------------------------
     *  FUNCTION      : updateAngles
     *  DESCRIPTION   : 
     *      Updates the orbit and rotation angles for Earth, Moon, and custom planets.
     *  PARAMETERS    : None
     *  RETURNS       : None
     *---------------------------------------------------------*/
    updateAngles()
    {
        // Update Earth and Moon angles
        this.earthOrbitAngle   += this.earthOrbitSpeed;
        this.earthRotationAngle += this.earthRotationSpeed;
        this.moonOrbitAngle    += this.moonOrbitSpeed;

        var i;

        // Update custom planets and their moons
        for (i = 0; i < this.customPlanets.length; i++)
        {
            var planet = this.customPlanets[i];
            planet.orbitAngle += planet.orbitSpeed;
            if (planet.hasMoon && planet.moon)
            {
                planet.moon.orbitAngle += planet.moon.orbitSpeed;
            }
        }
    }

    /*---------------------------------------------------------
     *  FUNCTION      : drawStars
     *  DESCRIPTION   :
     *    Draws static background stars.  Each star is rendered
     *    as a small white sphere.  Stars are generated once in 
     *    setup() and remain fixed.
     *  PARAMETERS    : None
     *  RETURNS       : None
     *---------------------------------------------------------*/

    drawStars()
    {
        push();
        stroke(255);
        strokeWeight(3);

        var i;
        for (i = 0; i < this.stars.length; i++)
        {
            var s = this.stars[i];
            push();
            translate(s.x, s.y, s.z);
            point(0, 0, 0);
            pop();
        }

        pop();
    }

    /*---------------------------------------------------------
     *  FUNCTION      : drawSun
     *  DESCRIPTION   :
     *    Renders the central Sun as a bright yellow sphere.
     *  PARAMETERS    : None
     *  RETURNS       : None
     *---------------------------------------------------------*/
    drawSun()
    {
        push();
        noStroke();
        ambientLight(255, 204, 0);
        ambientMaterial(250);
        sphere(this.SUN_RADIUS);
        pop();
    }

    /*---------------------------------------------------------
     *  FUNCTION      : drawEarthAndMoon
     *  DESCRIPTION   :
     *    Renders an Earth sphere orbiting the Sun and rotating
     *    on its own axis.  If the texture is unavailable, a 
     *    solid blue fill is used instead.
     *  PARAMETERS    : None
     *  RETURNS       : None
     *---------------------------------------------------------*/
    drawEarthAndMoon()
    {
        
    // ----- Earth orbit around Sun -----    
    push();

    // --- Calculate Earth’s orbit position around the Sun ---
    var earthX = cos(this.earthOrbitAngle) * this.earthDistance;
    var earthY = sin(this.earthOrbitAngle) * this.earthDistance;
    translate(earthX, earthY, 0);

    // --- rotate the Earth around its axis ---
    push();
    rotateY(this.earthRotationAngle);
    noStroke();
    
    // --- earth texture handling ---
    if (this.earthTexture)
    {
        texture(this.earthTexture);
    }
    else
    {
        ambientMaterial(250);
    }

    sphere(this.earthRadius);
    pop();

    // ----- Moon orbit around Earth -----
    push();

    // --- Calculate Moon’s orbit position around the Earth ---
    var moonX = cos(this.moonOrbitAngle) * this.moonDistance;
    var moonY = sin(this.moonOrbitAngle) * this.moonDistance;
    translate(moonX, moonY, 0);
    noStroke();

    // --- moon texture handling ---
    if (this.moonTexture)
    {
        texture(this.moonTexture);
    }
    else
    {
        ambientMaterial(250);
    }

    sphere(this.moonRadius);

    pop();
    pop();
}

/*---------------------------------------------------------
*  FUNCTION      : drawCustomPlanets
*  DESCRIPTION   : 
        Renders custom planets and their optional moons orbiting the Sun.
*  PARAMETERS    : None
*  RETURNS       : None
*---------------------------------------------------------*/
drawCustomPlanets()
{
    // ----- Custom planets orbit around Sun -----
    var i;
    for (i = 0; i < this.customPlanets.length; i++)
    {
        var planet = this.customPlanets[i];

        push();

        // --- Calculate planet’s orbit position around the Sun ---
        var planetX = cos(planet.orbitAngle) * planet.distance;
        var planetY = sin(planet.orbitAngle) * planet.distance;
        translate(planetX, planetY, 0);
        noStroke();

        fill(planet.colour[0], planet.colour[1], planet.colour[2]);
        sphere(planet.radius);

        // ----- Moon orbit around Planet -----
        if (planet.hasMoon && planet.moon)
        {
            push();

            // --- Calculate Moon’s orbit position around the Planet ---
            var moonX = cos(planet.moon.orbitAngle) * planet.moon.distance;
            var moonY = sin(planet.moon.orbitAngle) * planet.moon.distance;
            translate(moonX, moonY, 0);
            noStroke();

            // --- moon texture handling --- 
            if (this.moonTexture) {
                texture(this.moonTexture);   
            } else {
                ambientMaterial(200);        
            }
            sphere(planet.moon.radius);

            pop();
        }

        pop();
    }
}

    /*---------------------------------------------------------
     *  FUNCTION      : setupUI
     *  DESCRIPTION   : 
     *      Sets up the user interface for controlling the solar system parameters.
     * PARAMETERS    : None
     * RETURNS       : None
     *---------------------------------------------------------*/
    setupUI()
    {
        var self = this;

        // Main container for canvas and controls panel
        var mainContainer = createDiv();
        mainContainer.style("display", "flex");
        mainContainer.style("flex-direction", "row");
        mainContainer.style("align-items", "flex-start");

        // Canvas container (left)
        this.canvas.parent(mainContainer);

        // control panel (right)
        this.uiContainer = createDiv();
        this.uiContainer.style("padding", "10px");
        this.uiContainer.style("background", "#f0f0f0");
        this.uiContainer.style("min-width", "260px");
        this.uiContainer.parent(mainContainer);

        var parentId = this.uiContainer;

        var earthHeader = createElement("h3", "Earth/Moon Controls");
        earthHeader.parent(parentId);
        earthHeader.style("text-align", "center");
        earthHeader.style("width", "100%");

        // Earth distance slider
        createP("Earth Distance from Sun").parent(parentId);
        this.earthDistanceSlider = createSlider(100, 300, this.earthDistance, 1);
        this.earthDistanceSlider.parent(parentId);
        this.earthDistanceSlider.style("width", "100%");
        this.earthDistanceLabel = createSpan(String(this.earthDistance));
        this.earthDistanceLabel.parent(parentId);
        this.earthDistanceLabel.style("display", "block");

        this.earthDistanceSlider.input(function () {
            self.earthDistance = self.earthDistanceSlider.value();
            self.earthDistanceLabel.html(String(self.earthDistance));
        });

        // Earth rotation speed slider
        createP("Earth Rotation Speed").parent(parentId);
        this.earthSpeedSlider = createSlider(0, 0.1, this.earthRotationSpeed, 0.001);
        this.earthSpeedSlider.parent(parentId);
        this.earthSpeedSlider.style("width", "100%");
        this.earthSpeedLabel = createSpan(this.earthRotationSpeed.toFixed(3));
        this.earthSpeedLabel.parent(parentId);
        this.earthSpeedLabel.style("display", "block");

        this.earthSpeedSlider.input(function () {
            self.earthRotationSpeed = self.earthSpeedSlider.value();
            self.earthSpeedLabel.html(self.earthRotationSpeed.toFixed(3));
        });

        // Moon distance slider
        createP("Moon Distance from Earth").parent(parentId);
        this.moonDistanceSlider = createSlider(20, 120, this.moonDistance, 1);
        this.moonDistanceSlider.parent(parentId);
        this.moonDistanceSlider.style("width", "100%");
        this.moonDistanceLabel = createSpan(String(this.moonDistance));
        this.moonDistanceLabel.parent(parentId);
        this.moonDistanceLabel.style("display", "block");

        this.moonDistanceSlider.input(function () {
            self.moonDistance = self.moonDistanceSlider.value();
            self.moonDistanceLabel.html(String(self.moonDistance));
        });

        // Moon Rotation speed slider
        createP("Moon Rotation Speed").parent(parentId);
        this.moonSpeedSlider = createSlider(0, 0.05, this.moonOrbitSpeed, 0.001);
        this.moonSpeedSlider.parent(parentId);
        this.moonSpeedSlider.style("width", "100%");
        this.moonSpeedLabel = createSpan(this.moonOrbitSpeed.toFixed(3));
        this.moonSpeedLabel.parent(parentId);
        this.moonSpeedLabel.style("display", "block");

        this.moonSpeedSlider.input(function () {
            self.moonOrbitSpeed = self.moonSpeedSlider.value();
            self.moonSpeedLabel.html(self.moonOrbitSpeed.toFixed(3));
        });

        // Stars count input textbox
        var starHeader = createElement("h3", "Generate the stars");
        starHeader.parent(parentId);
        starHeader.style("text-align", "center");
        starHeader.style("width", "100%");
        createP("Number of Stars").parent(parentId);
        this.starInput = createInput(String(this.starCount));
        this.starInput.parent(parentId);

        var starBtn = createButton("Generate");
        starBtn.parent(parentId);
        starBtn.mousePressed(function () {
            var n = int(self.starInput.value());
            if (isNaN(n) || n < 0) {
                n = 0;
            }
            self.starCount = n;
            self.generateStars(self.starCount);
        });

        // Custom planets section
        var planetHeader = createElement("h3", "Additional planets");
        planetHeader.parent(parentId);
        planetHeader.style("text-align", "center");
        planetHeader.style("margin-top", "36px");
        planetHeader.style("width", "100%");

        // Planet size slider
        createP("Planet Size (Radius)").parent(parentId);
        this.planetSizeSlider = createSlider(5, 50, 15, 1);
        this.planetSizeSlider.parent(parentId);
        this.planetSizeSlider.style("width", "100%");
        this.planetSizeLabel = createSpan(String(this.planetSizeSlider.value()));
        this.planetSizeLabel.parent(parentId);
        this.planetSizeLabel.style("display", "block");

        this.planetSizeSlider.input(function () {
            self.planetSizeLabel.html(String(self.planetSizeSlider.value()));
        });

        // Planet distance slider
        createP("Planet Distance from Sun").parent(parentId);
        this.planetDistanceSlider = createSlider(80, 300, 150, 1);
        this.planetDistanceSlider.parent(parentId);
        this.planetDistanceSlider.style("width", "100%");
        this.planetDistanceLabel = createSpan(String(this.planetDistanceSlider.value()));
        this.planetDistanceLabel.parent(parentId);
        this.planetDistanceLabel.style("display", "block");

        this.planetDistanceSlider.input(function () {
            self.planetDistanceLabel.html(String(self.planetDistanceSlider.value()));
        });

        // Planet orbit speed slider
        createP("Planet Orbit Speed").parent(parentId);
        this.planetSpeedSlider = createSlider(0, 0.05, 0.01, 0.001);
        this.planetSpeedSlider.parent(parentId);
        this.planetSpeedSlider.style("width", "100%");
        this.planetSpeedLabel = createSpan(this.planetSpeedSlider.value().toFixed(3));
        this.planetSpeedLabel.parent(parentId);
        this.planetSpeedLabel.style("display", "block");

        this.planetSpeedSlider.input(function () {
            self.planetSpeedLabel.html(self.planetSpeedSlider.value().toFixed(3));
        });

        // Planet colour sliders
        createP("Planet Colour (RGB)").parent(parentId);
        this.planetRSlider = createSlider(0, 255, 150, 1);
        this.planetRSlider.parent(parentId);
        this.planetRSlider.style("width", "100%");
        this.planetGSlider = createSlider(0, 255, 150, 1);
        this.planetGSlider.parent(parentId);
        this.planetGSlider.style("width", "100%");
        this.planetBSlider = createSlider(0, 255, 150, 1);
        this.planetBSlider.parent(parentId);
        this.planetBSlider.style("width", "100%");

        this.planetColourLabel = createSpan("R: 150, G: 150, B: 150");
        this.planetColourLabel.parent(parentId);
        this.planetColourLabel.style("display", "block");
        this.planetColourLabel.style("margin-bottom", "8px");

        function updatePlanetColourLabel() {
            var r = self.planetRSlider.value();
            var g = self.planetGSlider.value();
            var b = self.planetBSlider.value();
            self.planetColourLabel.html("R: " + r + ", G: " + g + ", B: " + b);
        }

        this.planetRSlider.input(updatePlanetColourLabel);
        this.planetGSlider.input(updatePlanetColourLabel);
        this.planetBSlider.input(updatePlanetColourLabel);

        // Planet has moon checkbox
        this.planetHasMoonCheckbox = createCheckbox("Planet has a Moon", false);
        this.planetHasMoonCheckbox.parent(parentId);
        this.planetHasMoonCheckbox.style("display", "block");
        this.planetHasMoonCheckbox.style("margin-bottom", "6px");

        // Moon size slider
        createP("Custom Moon Size (Radius)").parent(parentId);
        this.planetMoonSizeSlider = createSlider(3, 20, 5, 1);
        this.planetMoonSizeSlider.parent(parentId);
        this.planetMoonSizeSlider.style("width", "100%");
        this.planetMoonSizeLabel = createSpan(String(this.planetMoonSizeSlider.value()));
        this.planetMoonSizeLabel.parent(parentId);
        this.planetMoonSizeLabel.style("display", "block");

        this.planetMoonSizeSlider.input(function () {
            self.planetMoonSizeLabel.html(String(self.planetMoonSizeSlider.value()));
        });

        // Moon distance slider from planet
        createP("Custom Moon Distance from Planet").parent(parentId);
        this.planetMoonDistanceSlider = createSlider(20, 120, 40, 1);
        this.planetMoonDistanceSlider.parent(parentId);
        this.planetMoonDistanceSlider.style("width", "100%");
        this.planetMoonDistanceLabel = createSpan(String(this.planetMoonDistanceSlider.value()));
        this.planetMoonDistanceLabel.parent(parentId);
        this.planetMoonDistanceLabel.style("display", "block");

        this.planetMoonDistanceSlider.input(function () {
            self.planetMoonDistanceLabel.html(String(self.planetMoonDistanceSlider.value()));
        });

        // Moon orbit speed slider
        createP("Custom Moon Orbit Speed").parent(parentId);
        this.planetMoonSpeedSlider = createSlider(0, 0.05, 0.02, 0.001);
        this.planetMoonSpeedSlider.parent(parentId);
        this.planetMoonSpeedSlider.style("width", "100%");
        this.planetMoonSpeedLabel = createSpan(this.planetMoonSpeedSlider.value().toFixed(3));
        this.planetMoonSpeedLabel.parent(parentId);
        this.planetMoonSpeedLabel.style("display", "block");

        this.planetMoonSpeedSlider.input(function () {
            self.planetMoonSpeedLabel.html(self.planetMoonSpeedSlider.value().toFixed(3));
        });

        // Create planet button
        this.createPlanetButton = createButton("Create Planet");
        this.createPlanetButton.parent(parentId);
        this.createPlanetButton.style("margin-top", "11px");
        this.createPlanetButton.mousePressed(function () {
            self.createCustomPlanet();
        });

        // Remove last custom planet button
        this.removePlanetButton = createButton("Remove Last Custom Planet");
        this.removePlanetButton.parent(parentId);
        this.removePlanetButton.style("display", "block");
        this.removePlanetButton.style("margin-top", "16px");
        this.removePlanetButton.mousePressed(function () {
            if (self.customPlanets.length > 0) {
                self.customPlanets.pop();
            }
        });

        // Pause and Reset buttons
        var controlHeader = createElement("h3", "Controls");
        controlHeader.parent(parentId);
        controlHeader.style("text-align", "center");
        controlHeader.style("width", "100%");

        this.pauseButton = createButton("Pause Rotation");
        this.pauseButton.parent(parentId);
        this.pauseButton.mousePressed(function () {
            self.paused = !self.paused;
            if (self.paused) {
                self.pauseButton.html("Resume Rotation");
            } else {
                self.pauseButton.html("Pause Rotation");
            }
        });

        this.resetButton = createButton("Reset to Default");
        this.resetButton.parent(parentId);
        this.resetButton.style("margin-left", "16px");
        this.resetButton.mousePressed(function () {
            self.resetToDefaults();
        });
    }

    /*---------------------------------------------------------
     *  FUNCTION      : createCustomPlanet
     *  DESCRIPTION   : 
     *      Creates a custom planet based on user input from the UI sliders and checkboxes.
     *  PARAMETERS    : None
     *  RETURNS       : None
     *---------------------------------------------------------*/

    createCustomPlanet()
    {
        // Read values from control panel elements
        var radius     = this.planetSizeSlider.value();
        var distance   = this.planetDistanceSlider.value();
        var orbitSpeed = this.planetSpeedSlider.value();

        // Colour components sliders
        var r = this.planetRSlider.value();
        var g = this.planetGSlider.value();
        var b = this.planetBSlider.value();
        var colourArr = [r, g, b];

        // Check if planet has a moon
        var hasMoon = this.planetHasMoonCheckbox.checked();

        // Create planet object
        var planet = {
            radius: radius,
            distance: distance,
            orbitSpeed: orbitSpeed,
            orbitAngle: 0,
            colour: colourArr,
            hasMoon: hasMoon,
            moon: null
        };

        // If planet has a moon, create moon object
        if (hasMoon)
        {
            var moonRadius     = this.planetMoonSizeSlider.value();
            var moonDistance   = this.planetMoonDistanceSlider.value();
            var moonOrbitSpeed = this.planetMoonSpeedSlider.value();

            planet.moon = {
                radius: moonRadius,
                distance: moonDistance,
                orbitSpeed: moonOrbitSpeed,
                orbitAngle: 0
            };
        }

        // Add planet to custom planets array
        this.customPlanets.push(planet);
    }

    /*---------------------------------------------------------
     *  FUNCTION      : resetToDefaults
     *  DESCRIPTION   : 
     *      Resets all parameters and UI elements to their default values.
     *  PARAMETERS    : None
     *  RETURNS       : None
     *---------------------------------------------------------*/

    resetToDefaults()
    {
        // Reset initial parameters
        this.initDefaults();
        this.generateStars(this.DEFAULT_STAR_COUNT);

        if (this.earthDistanceSlider && this.earthDistanceLabel) {
            this.earthDistanceSlider.value(this.defaultEarthDistance);
            this.earthDistanceLabel.html(String(this.defaultEarthDistance));
        }

        if (this.earthSpeedSlider && this.earthSpeedLabel) {
            this.earthSpeedSlider.value(this.defaultEarthRotationSpeed);
            this.earthSpeedLabel.html(this.defaultEarthRotationSpeed.toFixed(3));
        }

        if (this.moonDistanceSlider && this.moonDistanceLabel) {
            this.moonDistanceSlider.value(this.defaultMoonDistance);
            this.moonDistanceLabel.html(String(this.defaultMoonDistance));
        }

        if (this.moonSpeedSlider && this.moonSpeedLabel) {
            this.moonSpeedSlider.value(this.defaultMoonOrbitSpeed);
            this.moonSpeedLabel.html(this.defaultMoonOrbitSpeed.toFixed(3));
        }

        if (this.starInput) {
            this.starInput.value(String(this.DEFAULT_STAR_COUNT));
        }

        // Reset custom planet controls
        if (this.planetSizeSlider){
            this.planetSizeSlider.value(15);
        }
        if (this.planetSizeLabel) {
            this.planetSizeLabel.html(String(15));
        }
        if (this.planetDistanceSlider) {
            this.planetDistanceSlider.value(150);
        }
        if (this.planetDistanceLabel) {
            this.planetDistanceLabel.html(String(150));
        }
        if (this.planetSpeedSlider) {
            this.planetSpeedSlider.value(0.01);
        }
        if (this.planetSpeedLabel) {
            this.planetSpeedLabel.html((0.01).toFixed(3));
        }
        if (this.planetRSlider) {
        this.planetRSlider.value(150);
        }
        if (this.planetGSlider) {
        this.planetGSlider.value(150);
        }
        if (this.planetBSlider) {
        this.planetBSlider.value(150);
        }
        if (this.planetHasMoonCheckbox) {
        this.planetHasMoonCheckbox.checked(false);
        }
        if (this.planetMoonSizeSlider) {
        this.planetMoonSizeSlider.value(5);
        }
        if (this.planetMoonSizeLabel) {
            this.planetMoonSizeLabel.html(String(5));
        }
        if (this.planetMoonDistanceSlider) {
        this.planetMoonDistanceSlider.value(40);
        } 
        if (this.planetMoonDistanceLabel) {
            this.planetMoonDistanceLabel.html(String(40));
        }
        if (this.planetMoonSpeedSlider) {
        this.planetMoonSpeedSlider.value(0.02);
        } 
        if (this.planetMoonSpeedLabel) {
            this.planetMoonSpeedLabel.html((0.02).toFixed(3));
        }
        if (this.planetColourLabel){       
            this.planetColourLabel.html("R: 150, G: 150, B: 150");}
            
        this.paused = false;
        if (this.pauseButton) {
            this.pauseButton.html("Pause Rotation");
        }
    }
}

//-------------------------------------------------------------
// p5.js Integration Section
// These three functions act as the “puppet master,” similar 
// to a main() function that delegates to the SolarSystem object.
//-------------------------------------------------------------

let solarSystemApp; // single object instance (minimal global)

/*---------------------------------------------------------
 *  FUNCTION      : preload
 *  DESCRIPTION   :
 *    Invoked automatically by p5.js before setup().
 *    Delegates asset loading to the SolarSystem instance.
 *---------------------------------------------------------*/
function preload()
{
    solarSystemApp = new SolarSystem();
    solarSystemApp.preloadAssets();
}

/*---------------------------------------------------------
 *  FUNCTION      : setup
 *  DESCRIPTION   :
 *    Invoked once by p5.js.  Calls setup() on the main object.
 *---------------------------------------------------------*/
function setup()
{
    solarSystemApp.setup();
}

/*---------------------------------------------------------
 *  FUNCTION      : draw
 *  DESCRIPTION   :
 *    Invoked repeatedly by p5.js (~60 fps).  Updates and draws
 *    the solar system scene.
 *---------------------------------------------------------*/
function draw()
{
    solarSystemApp.update();
    solarSystemApp.drawScene();
}
