# streamBoss.js PhantomBot module

This is a BitBoss type module written for PhantomBot.  After first initialization, the script will created
4 files in the `./addons/` directory.  These 4 files will be named `maxbosshp.txt`, `maxchathp.txt`, `bosshp.txt` and `chathp.txt`.
These files will contain the current value of the HP for both the StreamBoss and for chat, and also the max/starting values for each.
They can be used to display the status of the current StreamBoss battle on a streaming overlay.  To display
the contents of a file hosted remotely, use this link in OBS:

http://[host]:[port]/addons/[filename].txt?webauth_ro=[my_key]&refresh

replacing anything in the `[]`'s with your info.

The boss will autoattack chat at random intervals, checking to see if an attack should take place every 15 seconds,
the upper and lower limits of which are customizable by the user.
Once either chat or the boss is defeated, the autoattack flag will be set to false to avoid spamming chat.

The module is quite customizable with the following commands:

`!streamboss basebosshp`     - Set the starting HP for the StreamBoss. (Minimum value: 100)
`!streamboss basechathp`     - Set the starting HP for the Chat Room. (Minimum value: 100)
`!streamboss maxdamage`      - The highest amount of damage that a normal attack can do. (Minimum value: 10)
`!streamboss mindamage`      - The lowest amount of damage that a normal attack can do. (Minimum value: 1)
`!streamboss misschance`     - The percent of the time an attack will miss. (Maximum: 25)
`!streamboss critchance`     - The percent of the time an attack will a critical hit. (Maximum: 25)
`!streamboss critmultiplier` - The number of times maxdamage get multiplied in the event of a critical hit. (Range: 2-10)
`!streamboss bitsmultipler`  - How much HP every bit, or each penny of a donation, hits the boss for.
`!streamboss slowattack`     - The longest time, in minutes, between boss attacks. (Maximum value: 10)
`!streamboss fastattack`     - The shortest time, in minutes, between boss attacks. (Minimum value: 1)
`!streamboss autoattack`     - This flag will toggle whether the boss will randomly attack chat.
`!streamboss victorysound`   - Choose which working audiohook should be played when the boss gets defeated.
`!streamboss victorytoggle`  - This flag will toggle whether the audiohook should be played when the boss gets defeated.
`!streamboss reset`          - Resets both boss and chat HP to the base values, and turns autoattack back on.
