## Overview

I solved the objects in order:

1. sphere
2. Platonic solid
3. torus
4. `makeRevolution`

after which I made the smoothness of shapes controllable

#### Sphere

Being the first shape I drew, the sphere was a bit of a challenge. I had some trouble initially with the trig required to determine where points should go, but once I actually sat down and drew out the triangles I managed to figure it out. The approach I took was to build the top and bottom individually (since they have the special-case points `(0,0, radius)` and `(0,0,-radius)`, respectively) and then reuse the same logic used to calculate the top and bottom rings for the inner rings. This worked, but I did have parity issues when trying to alternate colors, which I believe were caused by `sin` becoming negative after half a revolution. I probably could have adjusted for this, but instead I made my sphere faces random colors.

#### Platonic solid

This was very easy. The stellated octahedron points have coordinates that are either 1, 0, or -1, which made my life easier.

#### Torus

Having done the sphere, the torus was fairly straightforward. I essentially found the offset from the center to the center of the torus cross-section, and then the offset from the center of the torus cross-section to each point on the torus. Then I "swept" this around the center of the torus itself.

#### `makeRevolution`

Because of how I did the torus, it was incredibly easy to implement this function. Essentially the only change was that instead of making each cross-section a circle, I just iterated through the points in the given array.

#### Adjustable smoothness

All the round shapes that I had made had a hardcoded "smoothness" (i.e. number of segments). Instead of this, I wanted to make the smoothness controllable by the keyboard. The actual keyboard handling was fairly easy, but it took me a bit to realize that in addition to calling `glutPostRedisplay`, I also had to re-make the round shapes with the new smoothness.

You can control the smoothness by pressing `o` (decrease smoothness) and `p` (increase smoothness).
