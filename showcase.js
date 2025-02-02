//
// Program 1: object showcase
//
// showcase.js
//
// CSCI 385: Computer Graphics, Reed College, Fall 2024.
//
// This is a sample `opengl.js` program that displays a tetrahedron 
// made up of triangular facets, and also a cube and a cylinder.
//
// The OpenGL drawing part of the code occurs in `drawScene` and that
// function relies on `drawObject` to do its work. There is a global
// variable `gShowWhich` that can be changed by the user (by pressing
// number keys handled by handleKey). The `drawObject` code calls
// `glBeginEnd` to draw the chosen object.
//
// Your assignment is to add these models to the showcase code:
//
// - Sphere: A faceted model of the surface of a sphere.
// - Platonic: One of the other three Platomnic solids.
// - Torus: A faceted model of the surface of a torus.
// - Revolution: Two other *surfaces of revolution*.
//
// For each of these, you'll write functions that describe the
// object in 3-space, modify `drawObject` to draw them, and modify
// the keyboard handler code in `handleKey` to allow the user to
// select and configure them.
//
// This is all described in the web document
//
//   http://jimfix.github.io/csci385/assignments/showcase.html
//

// ***** GLOBALS *****

// Globals for tracking mouse drags.
//
let gOrientation = quatClass.for_rotation(0.0, new Vector3d(1.0,0.0,0.0));
let gMouseStart  = {x: 0.0, y: 0.0};
let gMouseDrag   = false;

// Global for which object is being shown.
//
let gShowWhich = 1;

// Global smoothness variable
let gSmoothness = 24;

// Global list of points for revolutions (since they must be recreated)
let gRevolutionPoints = {
    glass: [{x: 0, y: 0}, {x: 1, y: 1}, {x: 1.1, y: 1}, {x: 0.1, y: 0.1}, {x: 0.1, y: -0.9}, {x: 0.5, y: -1}, {x: 0.3, y: -1}, {x: 0, y: -0.975}],
    face: [{x: 0, y: 1.6}, {x: 0.4, y: 1.4}, {x: 0.36, y: 1.34}, {x: 0.5, y: 1.2}, {x: 0.4, y: 1.2}, {x: 0.44, y: 1.10}, {x: 0.42, y: 1.08}, {x: 0.44, y: 1.06}, {x: 0.4, y: 1.0}, {x: 0.44, y: 0.96}, {x: 0.44, y: 0.92}, {x: 0.4, y: 0.88}, {x: 0.10, y: 0.84}, {x: 0.12, y: 0.6}],
}

// ***** MAKERS *****
//
// Functions that describe objects in the showcase. These get called
// in `main` when the applications sets itself up.
//

//
// makeCube
//
// This describes the facets of a cube whose sides are unit length
// and is centered at the origin.
//
// The name of the object is "Cube".
//
function makeCube() {
    
    glBegin(GL_TRIANGLES,"Cube",true);
    // front
    glColor3f(0.5,0.5,0.0);
    glVertex3f(-0.5,-0.5, 0.5);
    glVertex3f( 0.5,-0.5, 0.5);
    glVertex3f( 0.5, 0.5, 0.5);
    
    glVertex3f( 0.5, 0.5, 0.5);
    glVertex3f(-0.5, 0.5, 0.5);
    glVertex3f(-0.5,-0.5, 0.5);
    
    // back
    glColor3f(0.5,0.5,1.0);
    glVertex3f(-0.5,-0.5,-0.5);
    glVertex3f( 0.5,-0.5,-0.5);
    glVertex3f( 0.5, 0.5,-0.5);
    
    glVertex3f( 0.5, 0.5,-0.5);
    glVertex3f(-0.5, 0.5,-0.5);
    glVertex3f(-0.5,-0.5,-0.5);

    // left
    glColor3f(1.0,0.5,0.5);
    glVertex3f(-0.5,-0.5,-0.5);
    glVertex3f(-0.5, 0.5,-0.5);
    glVertex3f(-0.5, 0.5, 0.5);
    
    glVertex3f(-0.5, 0.5, 0.5);
    glVertex3f(-0.5,-0.5, 0.5);
    glVertex3f(-0.5,-0.5,-0.5);
    
    // right
    glColor3f(0.0,0.5,0.5);
    glVertex3f( 0.5,-0.5,-0.5);
    glVertex3f( 0.5, 0.5,-0.5);
    glVertex3f( 0.5, 0.5, 0.5);
    
    glVertex3f( 0.5, 0.5, 0.5);
    glVertex3f( 0.5,-0.5, 0.5);
    glVertex3f( 0.5,-0.5,-0.5);
    
    // top
    glColor3f(0.5,1.0,0.5);
    glVertex3f(-0.5, 0.5,-0.5);
    glVertex3f( 0.5, 0.5,-0.5);
    glVertex3f( 0.5, 0.5, 0.5);
    
    glVertex3f( 0.5, 0.5, 0.5);
    glVertex3f(-0.5, 0.5, 0.5);
    glVertex3f(-0.5, 0.5,-0.5);

    // bottom
    glColor3f(0.5,0.0,0.5);
    glVertex3f(-0.5,-0.5,-0.5);
    glVertex3f( 0.5,-0.5,-0.5);
    glVertex3f( 0.5,-0.5, 0.5);
    
    glVertex3f( 0.5,-0.5, 0.5);
    glVertex3f(-0.5,-0.5, 0.5);
    glVertex3f(-0.5,-0.5,-0.5);

    //
    glEnd();
}

//
// makeCylinder
//
// Describes the facets of a cylindrical object. 
//
// The `smoothness` parameter gives the number of sides in the polygon
// of the cylinder's cross section. It should be even, because of the
// coloring.
//
// The object name for glBeginEnd is "Cylinder".
//
function makeCylinder(smoothness) {
    
    const width = 1.0;
    const numFacets = smoothness;
    const dAngle = 2.0 * Math.PI / numFacets;

    glBegin(GL_TRIANGLES, "Cylinder", true);

    // Produce the top.
    for (let i = 0; i < numFacets; i += 1) {
        const aTop = dAngle * i;
        const xTop0 = Math.cos(aTop);
        const yTop0 = Math.sin(aTop);
        const xTop1 = Math.cos(aTop + dAngle);
        const yTop1 = Math.sin(aTop + dAngle);
        if (i % 2 == 0) {
            glColor3f(0.25, 0.50, 0.75);
        } else {
            glColor3f(0.50, 0.75, 0.80);
        }
        glVertex3f(  0.0,   0.0, width / 2.0);
        glVertex3f(xTop0, yTop0, width / 2.0);
        glVertex3f(xTop1, yTop1, width / 2.0);
    }
    
    // Produce the sides.
    for (let i = 0; i < numFacets; i += 1) {
        const aMid = dAngle * i;
        const xMid0 = Math.cos(aMid);
        const yMid0 = Math.sin(aMid);
        const xMid1 = Math.cos(aMid + dAngle);
        const yMid1 = Math.sin(aMid + dAngle);
        
        glColor3f(0.25, 0.50, 0.75);
        glVertex3f(xMid0, yMid0,  width / 2.0);
        glVertex3f(xMid0, yMid0, -width / 2.0);
        glVertex3f(xMid1, yMid1, -width / 2.0);

        glColor3f(0.50, 0.75, 0.80);
        glVertex3f(xMid0, yMid0,  width / 2.0);
        glVertex3f(xMid1, yMid1, -width / 2.0);
        glVertex3f(xMid1, yMid1,  width / 2.0);

    }
    
    // Produce the bottom.
    for (let i = 0; i < numFacets; i += 1) {
        const aBottom = dAngle * i;
        const xBottom0 = Math.cos(aBottom);
        const yBottom0 = Math.sin(aBottom);
        const xBottom1 = Math.cos(aBottom + dAngle);
        const yBottom1 = Math.sin(aBottom + dAngle);
        if (i % 2 == 0) {
            glColor3f(0.25, 0.50, 0.75);
        } else {
            glColor3f(0.50, 0.75, 0.80);
        }
        glVertex3f(     0.0,      0.0, -width / 2.0);
        glVertex3f(xBottom0, yBottom0, -width / 2.0);
        glVertex3f(xBottom1, yBottom1, -width / 2.0);
    }
    
    glEnd();
}

//
// makeTetrahedron
//
// Describes the facets of a tetrahedron whose vertices sit at 4 of
// the 8 corners of the of the cube volume [-1,1] x [-1,1] x [-1,1].
//
// The name of the object is "Tetrahedron".
//
function makeTetrahedron() {

    // Draw all the triangular facets.
    glBegin(GL_TRIANGLES,"Tetrahedron",true);

    // The three vertices are +-+ ++- -++ ---

    // all but ---
    glColor3f(1.0,1.0,0.0);
    glVertex3f( 1.0,-1.0, 1.0);
    glVertex3f( 1.0, 1.0,-1.0);
    glVertex3f(-1.0, 1.0, 1.0);
    // all but ++-
    glColor3f(0.0,1.0,1.0);
    glVertex3f( 1.0,-1.0, 1.0);
    glVertex3f(-1.0, 1.0, 1.0);
    glVertex3f(-1.0,-1.0,-1.0);
    // all but -++
    glColor3f(1.0,0.0,1.0);
    glVertex3f(-1.0,-1.0,-1.0);
    glVertex3f( 1.0, 1.0,-1.0);
    glVertex3f( 1.0,-1.0, 1.0);
    // all but +-+
    glColor3f(1.0,1.0,1.0);
    glVertex3f( 1.0, 1.0,-1.0);
    glVertex3f(-1.0,-1.0,-1.0);
    glVertex3f(-1.0, 1.0, 1.0);

    glEnd();
}

function makeSphere() {
    const radius = 1.0;
    const numFacets = gSmoothness;
    const dAngle = 2.0 * Math.PI / numFacets;


    glBegin(GL_TRIANGLES, "sphere", true);

    let ringRadius = radius * Math.sin(dAngle);

    // bottom ring
    let z = -radius * Math.cos(dAngle);
    for (let i = 0; i < numFacets; i++) {
        const x = ringRadius * Math.cos(dAngle * i);
        const y = ringRadius * Math.sin(dAngle * i);
        const xNext = ringRadius * Math.cos(dAngle * (i+1));
        const yNext = ringRadius * Math.sin(dAngle * (i+1));

        glColor3f(Math.random(), Math.random(), Math.random());
        glVertex3f(0.0, 0.0, -radius);
        glVertex3f(x, y, z);
        glVertex3f(xNext, yNext, z);
    }

    // inner rings
    for (let j = 1; j < (numFacets - 1); j++) {
        ringRadius = radius * Math.sin(dAngle * j);
        rrNext = radius * Math.sin(dAngle * (j+1));
        z = radius * Math.cos(dAngle * j);
        zNext = radius * Math.cos(dAngle * (j+1));
        for (let i = 0; i < numFacets / 2; i++) {
            const x = ringRadius * Math.cos(dAngle * i);
            const y = ringRadius * Math.sin(dAngle * i);
            const xNext = ringRadius * Math.cos(dAngle * (i+1));
            const yNext = ringRadius * Math.sin(dAngle * (i+1));

            const rrX = rrNext * Math.cos(dAngle * i);
            const rrY = rrNext * Math.sin(dAngle * i);
            const rrXNext = rrNext * Math.cos(dAngle * (i+1));
            const rrYNext = rrNext * Math.sin(dAngle * (i+1));

            const r = Math.random();
            const g = Math.random();
            const b = Math.random();
            glColor3f(r, g, b);
            glVertex3f(x, y, z);
            glVertex3f(xNext, yNext, z);
            glVertex3f(rrX, rrY, zNext);
            glColor3f(r, g, b);
            glVertex3f(rrX, rrY, zNext);
            glVertex3f(rrXNext, rrYNext, zNext);
            glVertex3f(xNext, yNext, z);
        }
    }

    // top ring
    ringRadius = radius * Math.sin(dAngle);
    z = radius * Math.cos(dAngle);
    for (let i = 0; i < numFacets; i++) {
        const x = ringRadius * Math.cos(dAngle * i);
        const y = ringRadius * Math.sin(dAngle * i);
        const xNext = ringRadius * Math.cos(dAngle * (i+1));
        const yNext = ringRadius * Math.sin(dAngle * (i+1));

        glColor3f(Math.random(), Math.random(), Math.random());
        glVertex3f(0.0, 0.0, radius);
        glVertex3f(x, y, z);
        glVertex3f(xNext, yNext, z);
    }

    glEnd();
}

function makeSolid() {
    glBegin(GL_TRIANGLES, "stellated_octahedron", true);

    glColor3f(Math.random(), Math.random(), Math.random());
    glVertex3f(1.0, 1.0, 1.0);
    glVertex3f(0.0, 0.0, 1.0);
    glVertex3f(1.0, 0.0, 0.0);
    glColor3f(Math.random(), Math.random(), Math.random());
    glVertex3f(1.0, 1.0, 1.0);
    glVertex3f(0.0, 0.0, 1.0);
    glVertex3f(0.0, 1.0, 0.0);
    glColor3f(Math.random(), Math.random(), Math.random());
    glVertex3f(1.0, 0.0, 0.0);
    glVertex3f(1.0, 1.0, 1.0);
    glVertex3f(0.0, 1.0, 0.0);

    glColor3f(Math.random(), Math.random(), Math.random());
    glVertex3f(-1.0, 1.0, 1.0);
    glVertex3f(-0.0, 0.0, 1.0);
    glVertex3f(-1.0, 0.0, 0.0);
    glColor3f(Math.random(), Math.random(), Math.random());
    glVertex3f(-1.0, 1.0, 1.0);
    glVertex3f(-0.0, 0.0, 1.0);
    glVertex3f(-0.0, 1.0, 0.0);
    glColor3f(Math.random(), Math.random(), Math.random());
    glVertex3f(-1.0, 0.0, 0.0);
    glVertex3f(-1.0, 1.0, 1.0);
    glVertex3f(-0.0, 1.0, 0.0);

    glColor3f(Math.random(), Math.random(), Math.random());
    glVertex3f(1.0, -1.0, 1.0);
    glVertex3f(0.0, -0.0, 1.0);
    glVertex3f(1.0, -0.0, 0.0);
    glColor3f(Math.random(), Math.random(), Math.random());
    glVertex3f(1.0, -1.0, 1.0);
    glVertex3f(0.0, -0.0, 1.0);
    glVertex3f(0.0, -1.0, 0.0);
    glColor3f(Math.random(), Math.random(), Math.random());
    glVertex3f(1.0, -0.0, 0.0);
    glVertex3f(1.0, -1.0, 1.0);
    glVertex3f(0.0, -1.0, 0.0);

    glColor3f(Math.random(), Math.random(), Math.random());
    glVertex3f(-1.0, -1.0, 1.0);
    glVertex3f(-0.0, -0.0, 1.0);
    glVertex3f(-1.0, -0.0, 0.0);
    glColor3f(Math.random(), Math.random(), Math.random());
    glVertex3f(-1.0, -1.0, 1.0);
    glVertex3f(-0.0, -0.0, 1.0);
    glVertex3f(-0.0, -1.0, 0.0);
    glColor3f(Math.random(), Math.random(), Math.random());
    glVertex3f(-1.0, -0.0, 0.0);
    glVertex3f(-1.0, -1.0, 1.0);
    glVertex3f(-0.0, -1.0, 0.0);



    glColor3f(Math.random(), Math.random(), Math.random());
    glVertex3f(1.0, 1.0, -1.0);
    glVertex3f(0.0, 0.0, -1.0);
    glVertex3f(1.0, 0.0, -0.0);
    glColor3f(Math.random(), Math.random(), Math.random());
    glVertex3f(1.0, 1.0, -1.0);
    glVertex3f(0.0, 0.0, -1.0);
    glVertex3f(0.0, 1.0, -0.0);
    glColor3f(Math.random(), Math.random(), Math.random());
    glVertex3f(1.0, 0.0, -0.0);
    glVertex3f(1.0, 1.0, -1.0);
    glVertex3f(0.0, 1.0, -0.0);

    glColor3f(Math.random(), Math.random(), Math.random());
    glVertex3f(-1.0, 1.0, -1.0);
    glVertex3f(-0.0, 0.0, -1.0);
    glVertex3f(-1.0, 0.0, -0.0);
    glColor3f(Math.random(), Math.random(), Math.random());
    glVertex3f(-1.0, 1.0, -1.0);
    glVertex3f(-0.0, 0.0, -1.0);
    glVertex3f(-0.0, 1.0, -0.0);
    glColor3f(Math.random(), Math.random(), Math.random());
    glVertex3f(-1.0, 0.0, -0.0);
    glVertex3f(-1.0, 1.0, -1.0);
    glVertex3f(-0.0, 1.0, -0.0);

    glColor3f(Math.random(), Math.random(), Math.random());
    glVertex3f(1.0, -1.0, -1.0);
    glVertex3f(0.0, -0.0, -1.0);
    glVertex3f(1.0, -0.0, -0.0);
    glColor3f(Math.random(), Math.random(), Math.random());
    glVertex3f(1.0, -1.0, -1.0);
    glVertex3f(0.0, -0.0, -1.0);
    glVertex3f(0.0, -1.0, -0.0);
    glColor3f(Math.random(), Math.random(), Math.random());
    glVertex3f(1.0, -0.0, -0.0);
    glVertex3f(1.0, -1.0, -1.0);
    glVertex3f(0.0, -1.0, -0.0);

    glColor3f(Math.random(), Math.random(), Math.random());
    glVertex3f(-1.0, -1.0, -1.0);
    glVertex3f(-0.0, -0.0, -1.0);
    glVertex3f(-1.0, -0.0, -0.0);
    glColor3f(Math.random(), Math.random(), Math.random());
    glVertex3f(-1.0, -1.0, -1.0);
    glVertex3f(-0.0, -0.0, -1.0);
    glVertex3f(-0.0, -1.0, -0.0);
    glColor3f(Math.random(), Math.random(), Math.random());
    glVertex3f(-1.0, -0.0, -0.0);
    glVertex3f(-1.0, -1.0, -1.0);
    glVertex3f(-0.0, -1.0, -0.0);

    glEnd();
}

function makeTorus() {
    glBegin(GL_TRIANGLES, "torus", true);

    const radius = 1.0;
    const crossSectionRadius = 0.2;
    const numFacets = gSmoothness;
    const dAngle = 2.0 * Math.PI / numFacets;

    for (let i = 0; i < numFacets; i++) {
        const centerXAngle = Math.cos(dAngle * i);
        const centerYAngle = Math.sin(dAngle * i);
        const centerNextXAngle = Math.cos(dAngle * (i+1));
        const centerNextYAngle = Math.sin(dAngle * (i+1));

        for (let j = 0; j < numFacets; j++) {
            const outward = crossSectionRadius * Math.cos(dAngle * j);
            const z = crossSectionRadius * Math.sin(dAngle * j);
            const outwardNext = crossSectionRadius * Math.cos(dAngle * (j+1));
            const zNext = crossSectionRadius * Math.sin(dAngle * (j+1));

            const x1 = centerXAngle * (radius + outward);
            const y1 = centerYAngle * (radius + outward);
            const x2 = centerXAngle * (radius + outwardNext);
            const y2 = centerYAngle * (radius + outwardNext);
            const x3 = centerNextXAngle * (radius + outward);
            const y3 = centerNextYAngle * (radius + outward);
            const x4 = centerNextXAngle * (radius + outwardNext);
            const y4 = centerNextYAngle * (radius + outwardNext);

            const r = Math.random();
            const g = Math.random();
            const b = Math.random();

            glColor3f(r, g, b);
            glVertex3f(x1, y1, z);
            glVertex3f(x2, y2, zNext);
            glVertex3f(x3, y3, z);

            glColor3f(r, g, b);
            glVertex3f(x2, y2, zNext);
            glVertex3f(x3, y3, z);
            glVertex3f(x4, y4, zNext);
        }
    }

    glEnd();
}

function makeRevolution(name, points) {
    glBegin(GL_TRIANGLES, name, true);

    const numFacets = gSmoothness;
    const dAngle = 2.0 * Math.PI / numFacets;

    for (let i = 0; i < numFacets; i++) {
        const xAngle = Math.cos(dAngle * i);
        const yAngle = Math.sin(dAngle * i);
        const xNextAngle = Math.cos(dAngle * (i+1));
        const yNextAngle = Math.sin(dAngle * (i+1));

        for (let j = 0; j < points.length - 1; j++) {
            const outward = points[j].x;
            const z = points[j].y;
            const outwardNext = points[j+1].x;
            const zNext = points[j+1].y;

            const x1 = xAngle * outward;
            const y1 = yAngle * outward;
            const x2 = xAngle * outwardNext;
            const y2 = yAngle * outwardNext;
            const x3 = xNextAngle * outward;
            const y3 = yNextAngle * outward;
            const x4 = xNextAngle * outwardNext;
            const y4 = yNextAngle * outwardNext;

            const r = Math.random();
            const g = Math.random();
            const b = Math.random();

            glColor3f(r, g, b);
            glVertex3f(x1, y1, z);
            glVertex3f(x2, y2, zNext);
            glVertex3f(x3, y3, z);

            glColor3f(r, g, b);
            glVertex3f(x2, y2, zNext);
            glVertex3f(x3, y3, z);
            glVertex3f(x4, y4, zNext);
        }
    }

    glEnd();
}

// ***** RENDERING *****
//
// Functions for displaying the selected object of the showcase.
//

//
// drawObject
//
// Renders the 3-D object designated by the global `gShowWhich`.
//
function drawObject() {

    /*
     * Draw the object selected by the user.
     */
    
    if (gShowWhich == 1) {
        glBeginEnd("Tetrahedron");
    }
    if (gShowWhich == 2) {
        glBeginEnd("Cube");
    }
    if (gShowWhich == 3) {
        glBeginEnd("Cylinder");
    }
    if (gShowWhich == 4) {
        glBeginEnd("sphere");
    }
    if (gShowWhich == 5) {
        glBeginEnd("stellated_octahedron");
    }
    if (gShowWhich == 6) {
        glBeginEnd("torus");
    }
    if (gShowWhich == 7) {
        glBeginEnd("glass");
    }
    if (gShowWhich == 8) {
        glBeginEnd("face");
    }
    //
    // Add other objects for the assignment here.
    //
    
}

function drawScene() {
    /*
     * Issue GL calls to draw the scene.
     */

    // Clear the rendering information.
    glClearColor(0.2,0.2,0.3);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glEnable(GL_DEPTH_TEST);

    // Clear the transformation stack.
    glMatrixMode(GL_MODELVIEW);
    glLoadIdentity();

    // Transform the object by a rotation.
    gOrientation.glRotatef();

    // Draw the object.
    glPushMatrix();
    glScalef(0.5,0.5,0.5);
    drawObject();
    glPopMatrix();
    
    // Render the scene.
    glFlush();

}

// ***** INTERACTION *****
//
// Functions for supporting keypress and mouse input.

//
// handleKey
//
// Handles a keypress.
//
function handleKey(key, x, y) {

    //
    // Handle object selection.
    //
    if (key == '1') {
        gShowWhich = 1;
    }
    //
    if (key == '2') {
        gShowWhich = 2;
    }
    //
    if (key == '3') {
        gShowWhich = 3;
    }
    //
    if (key == '4') {
        gShowWhich = 4;
    }
    //
    if (key == '5') {
        gShowWhich = 5;
    }
    //
    if (key == '6') {
        gShowWhich = 6;
    }
    //
    if (key == '7') {
        gShowWhich = 7;
    }
    //
    if (key == '8') {
        gShowWhich = 8;
    }

    if (key == 'o') {
        gSmoothness /= 2;
        makeCylinder(gSmoothness);

        makeSphere();
        makeTorus();
        makeRevolution("glass", gRevolutionPoints['glass']);
        makeRevolution("face", gRevolutionPoints['face']);
    }
    if (key == 'p') {
        gSmoothness *= 2;
        makeCylinder(gSmoothness);

        makeSphere();
        makeTorus();
        makeRevolution("glass", gRevolutionPoints['glass']);
        makeRevolution("face", gRevolutionPoints['face']);
    }
    
    glutPostRedisplay();
}

//
// worldCoords
//
// Converts mouse click location coordinates to the OpenGL world's
// scene coordinates. Takes the mouse coordinates as `mousex` and `mousey`.
//
function worldCoords(mousex, mousey) {

    const pj = mat4.create();
    glGetFloatv(GL_PROJECTION_MATRIX,pj);
    const pj_inv = mat4.create();
    mat4.invert(pj_inv,pj);
    const vp = [0,0,0,0];
    glGetIntegerv(GL_VIEWPORT,vp);
    const mousecoords = vec4.fromValues(2.0*mousex/vp[2]-1.0,
                                        1.0-2.0*mousey/vp[3],
                                        0.0, 1.0);
    vec4.transformMat4(location,mousecoords,pj_inv);
    return {x:location[0], y:location[1]};
}    

// handleMouseClick
//
// Records the location of a mouse click in the OpenGL world's
// scene coordinates. Also notes whether the click was the
// start of the mouse being dragged.
//
// Sets the globals `gMouseStart` and `gMouseDrag` accordingly.
//
function handleMouseClick(button, state, x, y) {
    
    // Start tracking the mouse for trackball motion.
    gMouseStart  = worldCoords(x,y);
    if (state == GLUT_DOWN) {
        gMouseDrag = true;
    } else {
        gMouseDrag = false;
    }
    glutPostRedisplay()
}

// handleMouseMotion
//
// Reorients the object based on the movement of a mouse drag.
// This movement gets accumulated into `gOrientation`.
//
function handleMouseMotion(x, y) {
    
    /*
     * Uses the last and current location of mouse to compute a
     * trackball rotation. This gets stored in the quaternion
     * gOrientation.
     *
     */
    
    // Capture mouse's position.
    mouseNow = worldCoords(x,y)

    // Update object/light orientation based on movement.
    dx = mouseNow.x - gMouseStart.x;
    dy = mouseNow.y - gMouseStart.y;
    axis = (new Vector3d(-dy,dx,0.0)).unit()
    angle = Math.asin(Math.min(Math.sqrt(dx*dx+dy*dy),1.0))
    gOrientation = quatClass.for_rotation(angle,axis).times(gOrientation);

    // Ready state for next mouse move.
    gMouseStart = mouseNow;

    // Update window.
    glutPostRedisplay()
}

// ***** DRIVER *****

//
// Application driver and auxilliary functions.
//


function resizeWindow(w, h) {
    /*
     * Register a window resize by changing the viewport. 
     */
    glViewport(0, 0, w, h);
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    if (w > h) {
        glOrtho(-w/h, w/h, -1.0, 1.0, -1.0, 1.0);
    } else {
        glOrtho(-1.0, 1.0, -h/w * 1.0, h/w * 1.0, -1.0, 1.0);
    }
    glutPostRedisplay();
}

function main() {
    /*
     * The main procedure, sets up GL and GLUT.
     */

    // set up GL and GLUT, its canvas, and other components.
    glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB | GLUT_DEPTH);
    glutInitWindowPosition(0, 20);
    glutInitWindowSize(360, 360);
    glutCreateWindow('object showcase' )
    resizeWindow(360, 360);
    
    // Build the renderable objects.
    makeTetrahedron();
    makeCube();
    makeCylinder(gSmoothness);
    makeSphere();
    makeSolid();
    makeTorus();
    makeRevolution("glass", gRevolutionPoints['glass']);
    makeRevolution("face", gRevolutionPoints['face']);

    // Register interaction callbacks.
    glutKeyboardFunc(handleKey);
    glutReshapeFunc(resizeWindow);
    glutDisplayFunc(drawScene);
    glutMouseFunc(handleMouseClick)
    glutMotionFunc(handleMouseMotion)

    // Go!
    glutMainLoop();

    return 0;
}

glRun(main,true);
