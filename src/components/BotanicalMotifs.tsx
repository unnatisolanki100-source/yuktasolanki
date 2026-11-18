import React from 'react';

export function YukMonogram({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Outer delicate henna ring */}
      <circle cx="24" cy="24" r="22" fill="#FDF6F8" stroke="#111111" strokeWidth="0.9" />
      <circle
        cx="24"
        cy="24"
        r="19.2"
        stroke="#111111"
        strokeWidth="0.5"
        strokeDasharray="1.5 2.2"
        strokeOpacity="0.65"
      />

      {/* 8-petal mehndi lotus mandala (inspired by Yuk Creation organic cones) */}
      <path
        d="M24 7C26.4 11.2 27.6 14.5 27.6 17.5C27.6 19.6 26 21.2 24 21.2C22 21.2 20.4 19.6 20.4 17.5C20.4 14.5 21.6 11.2 24 7Z"
        fill="#EFE8F7"
        stroke="#111111"
        strokeWidth="0.85"
      />
      <path
        d="M24 41C26.4 36.8 27.6 33.5 27.6 30.5C27.6 28.4 26 26.8 24 26.8C22 26.8 20.4 28.4 20.4 30.5C20.4 33.5 21.6 36.8 24 41Z"
        fill="#EFE8F7"
        stroke="#111111"
        strokeWidth="0.85"
      />
      <path
        d="M7 24C11.2 21.6 14.5 20.4 17.5 20.4C19.6 20.4 21.2 22 21.2 24C21.2 26 19.6 27.6 17.5 27.6C14.5 27.6 11.2 26.4 7 24Z"
        fill="#F9E4EB"
        stroke="#111111"
        strokeWidth="0.85"
      />
      <path
        d="M41 24C36.8 21.6 33.5 20.4 30.5 20.4C28.4 20.4 26.8 22 26.8 24C26.8 26 28.4 27.6 30.5 27.6C33.5 27.6 36.8 26.4 41 24Z"
        fill="#F9E4EB"
        stroke="#111111"
        strokeWidth="0.85"
      />

      {/* Diagonal lotus petals */}
      <path
        d="M12 12C16.2 13.4 19.2 15.6 20.8 18.2C18.2 19.8 14.6 18.4 12 12Z"
        fill="#F9E4EB"
        stroke="#111111"
        strokeWidth="0.8"
      />
      <path
        d="M36 12C31.8 13.4 28.8 15.6 27.2 18.2C29.8 19.8 33.4 18.4 36 12Z"
        fill="#F9E4EB"
        stroke="#111111"
        strokeWidth="0.8"
      />
      <path
        d="M12 36C16.2 34.6 19.2 32.4 20.8 29.8C18.2 28.2 14.6 29.6 12 36Z"
        fill="#EFE8F7"
        stroke="#111111"
        strokeWidth="0.8"
      />
      <path
        d="M36 36C31.8 34.6 28.8 32.4 27.2 29.8C29.8 28.2 33.4 29.6 36 36Z"
        fill="#EFE8F7"
        stroke="#111111"
        strokeWidth="0.8"
      />

      {/* Sacred center bindu & inner bloom */}
      <circle cx="24" cy="24" r="4.6" fill="#F4D6E0" stroke="#111111" strokeWidth="0.9" />
      <circle cx="24" cy="24" r="1.6" fill="#111111" />
    </svg>
  );
}

export function LotusFlourish({
  className = 'w-24 h-8',
  tone = 'dark',
}: {
  className?: string;
  tone?: 'dark' | 'light';
}) {
  const strokeColor = tone === 'light' ? 'var(--theme-on-dark)' : 'var(--theme-accent)';
  const fillColor = tone === 'light' ? 'var(--theme-lotus-light-fill)' : 'var(--theme-lotus-fill)';

  return (
    <svg
      viewBox="0 0 120 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 18H44" stroke={strokeColor} strokeWidth="0.8" strokeOpacity="0.4" />
      <path d="M76 18H116" stroke={strokeColor} strokeWidth="0.8" strokeOpacity="0.4" />
      <path
        d="M60 6C62.5 11.5 66 14.8 66 19C66 22.8 63.3 25.5 60 25.5C56.7 25.5 54 22.8 54 19C54 14.8 57.5 11.5 60 6Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1"
      />
      <path
        d="M60 25.5C55.5 24 50.5 20.5 48 16.5C51.8 16.5 55.2 18.2 57.8 21.5"
        stroke={strokeColor}
        strokeWidth="0.9"
      />
      <path
        d="M60 25.5C64.5 24 69.5 20.5 72 16.5C68.2 16.5 64.8 18.2 62.2 21.5"
        stroke={strokeColor}
        strokeWidth="0.9"
      />
      <circle cx="60" cy="30" r="1.2" fill={strokeColor} />
    </svg>
  );
}

export function MehndiConesDesign({ className = 'w-full h-auto' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 520 440"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="coneBodyMain" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4D263E" />
          <stop offset="55%" stopColor="#361B2C" />
          <stop offset="100%" stopColor="#200D19" />
        </linearGradient>
        <linearGradient id="coneBodyLeft" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5C304B" />
          <stop offset="100%" stopColor="#2B1222" />
        </linearGradient>
        <linearGradient id="coneBodyRight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#422136" />
          <stop offset="100%" stopColor="#1D0A16" />
        </linearGradient>
      </defs>

      {/* Subtle Open Botanical Mandala Backdrop (No Box, No Frame) */}
      <g opacity="0.16">
        <circle cx="290" cy="185" r="138" stroke="#361B2C" strokeWidth="1" strokeDasharray="3 5" />
        <circle cx="290" cy="185" r="108" stroke="#361B2C" strokeWidth="0.8" />
        <circle cx="290" cy="185" r="76" stroke="#361B2C" strokeWidth="0.8" strokeDasharray="2 4" />
      </g>

      {/* Delicate Flowing Henna Swirls & Paisley Tendrils Emerging From Cone Tips */}
      <path
        d="M326 146C358 122 396 116 426 134C452 150 454 186 432 204C414 218 388 210 384 190C381 174 394 162 408 166"
        stroke="#361B2C"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M324 146C344 104 378 72 422 68C446 66 468 82 464 106"
        stroke="#361B2C"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeOpacity="0.85"
      />
      <path
        d="M352 178C392 178 430 206 438 248C445 282 424 316 394 322"
        stroke="#361B2C"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeOpacity="0.75"
      />

      {/* Lotus Bloom Drawn at Apex of Flowing Swirl */}
      <g transform="translate(392, 62) rotate(24)">
        <path
          d="M24 0C29 10 32 18 24 28C16 18 19 10 24 0Z"
          fill="#F5EDF2"
          stroke="#361B2C"
          strokeWidth="1.3"
        />
        <path
          d="M24 27C15 24 8 18 6 11C13 12 19 16 24 25"
          fill="#F5EDF2"
          stroke="#361B2C"
          strokeWidth="1.2"
        />
        <path
          d="M24 27C33 24 40 18 42 11C35 12 29 16 24 25"
          fill="#F5EDF2"
          stroke="#361B2C"
          strokeWidth="1.2"
        />
        <circle cx="24" cy="34" r="2.2" fill="#361B2C" />
      </g>

      {/* Fine Botanical Leaves Along Henna Vine */}
      <path
        d="M354 114C346 102 348 88 358 84C364 94 362 106 354 114Z"
        fill="#F5EDF2"
        stroke="#361B2C"
        strokeWidth="1.15"
      />
      <path
        d="M386 128C396 116 410 116 416 125C406 132 394 134 386 128Z"
        fill="#F5EDF2"
        stroke="#361B2C"
        strokeWidth="1.15"
      />
      <path
        d="M424 226C438 220 452 225 456 235C444 240 432 236 424 226Z"
        fill="#F5EDF2"
        stroke="#361B2C"
        strokeWidth="1.15"
      />
      <path
        d="M426 276C440 274 452 282 452 293C440 294 430 286 426 276Z"
        fill="#F5EDF2"
        stroke="#361B2C"
        strokeWidth="1.15"
      />

      {/* Beaded Henna Bindu Dots */}
      <circle cx="338" cy="136" r="2.2" fill="#361B2C" />
      <circle cx="347" cy="129" r="1.7" fill="#361B2C" />
      <circle cx="356" cy="123" r="1.4" fill="#361B2C" />
      <circle cx="470" cy="118" r="2.2" fill="#361B2C" />
      <circle cx="474" cy="130" r="1.6" fill="#361B2C" />
      <circle cx="384" cy="328" r="2.4" fill="#361B2C" />
      <circle cx="372" cy="333" r="1.7" fill="#361B2C" />

      {/* Back Left Handcrafted Henna Cone */}
      <g transform="rotate(-14 140 315)">
        <path
          d="M84 364L126 382L252 118C254 114 250 111 247 114L84 364Z"
          fill="url(#coneBodyLeft)"
        />
        <path
          d="M78 370C74 366 76 358 84 356L128 375C134 382 128 390 120 388L78 370Z"
          fill="#26101E"
        />
        {/* Foil/Tape Band */}
        <path d="M138 282L166 294L174 277L146 265Z" fill="#FAF6F8" fillOpacity="0.92" />
      </g>

      {/* Back Right Handcrafted Henna Cone */}
      <g transform="rotate(14 240 330)">
        <path
          d="M172 372L218 386L348 134C350 130 346 127 343 130L172 372Z"
          fill="url(#coneBodyRight)"
        />
        <path
          d="M166 378C162 374 164 366 172 364L220 379C226 386 220 394 212 392L166 378Z"
          fill="#1D0A16"
        />
        {/* Foil/Tape Band */}
        <path d="M226 294L254 305L262 288L234 277Z" fill="#FAF6F8" fillOpacity="0.92" />
      </g>

      {/* Center Hero Handcrafted Henna Cone With Crisp White Band & Lotus Seal */}
      <g>
        {/* Main Cone Body */}
        <path
          d="M112 384L172 414L330 144C332 140 328 137 325 140L112 384Z"
          fill="url(#coneBodyMain)"
        />
        {/* Subtle Cellophane Edge Highlight */}
        <path
          d="M126 386L322 147"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeOpacity="0.35"
          strokeLinecap="round"
        />
        {/* Folded Top Seal Crimp */}
        <path
          d="M104 392C98 386 102 374 112 374L175 405C182 414 174 424 164 422L104 392Z"
          fill="#26101E"
          stroke="#4D263E"
          strokeWidth="1.2"
        />
        <path
          d="M114 383L167 410"
          stroke="#F7F3EF"
          strokeWidth="0.9"
          strokeOpacity="0.45"
          strokeDasharray="2 3"
        />

        {/* Signature White Sleeve Band Around Center Cone */}
        <path
          d="M172 315L220 339L246 294L198 270Z"
          fill="#FFFFFF"
          stroke="#361B2C"
          strokeWidth="1.1"
        />

        {/* Circular Deep Plum Brand Seal With Lotus Inside Sleeve */}
        <g transform="translate(210, 305) rotate(28)">
          <circle cx="0" cy="0" r="18" fill="#361B2C" />
          <circle cx="0" cy="0" r="15.5" stroke="#FAF6F8" strokeWidth="0.6" strokeDasharray="1.5 2" />
          {/* Delicate White 8-Petal Lotus Emblem */}
          <path d="M0 -10C2.2 -5.5 2.2 -2 0 0C-2.2 -2 -2.2 -5.5 0 -10Z" fill="#FFFFFF" />
          <path d="M0 10C2.2 5.5 2.2 2 0 0C-2.2 2 -2.2 5.5 0 10Z" fill="#FFFFFF" />
          <path d="M-10 0C-5.5 -2.2 -2 -2.2 0 0C-2 2.2 -5.5 2.2 -10 0Z" fill="#FFFFFF" />
          <path d="M10 0C5.5 -2.2 2 -2.2 0 0C2 2.2 5.5 2.2 10 0Z" fill="#FFFFFF" />
          <path d="M-7 -7C-2.5 -5.5 -1 -3.5 0 0C-3.5 -1 -5.5 -2.5 -7 -7Z" fill="#FFFFFF" fillOpacity="0.85" />
          <path d="M7 -7C2.5 -5.5 1 -3.5 0 0C3.5 -1 5.5 -2.5 7 -7Z" fill="#FFFFFF" fillOpacity="0.85" />
          <path d="M-7 7C-2.5 5.5 -1 3.5 0 0C-3.5 1 -5.5 2.5 -7 7Z" fill="#FFFFFF" fillOpacity="0.85" />
          <path d="M7 7C2.5 5.5 1 3.5 0 0C3.5 1 5.5 2.5 7 7Z" fill="#FFFFFF" fillOpacity="0.85" />
          <circle cx="0" cy="0" r="2.1" fill="#361B2C" stroke="#FFFFFF" strokeWidth="0.8" />
        </g>

        {/* Fine Henna Filigree Cuff Near Cone Tip */}
        <path
          d="M270 210L292 221"
          stroke="#FAF6F8"
          strokeWidth="1.2"
          strokeOpacity="0.7"
          strokeLinecap="round"
        />
        <path
          d="M279 196L298 206"
          stroke="#FAF6F8"
          strokeWidth="0.9"
          strokeOpacity="0.55"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

export function CornerBotanical({ className = 'w-20 h-20' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M10 70C14 48 28 24 66 14"
        stroke="#111111"
        strokeWidth="0.9"
        strokeOpacity="0.35"
      />
      <path
        d="M24 44C20 37 22 29 28 26C30 33 29 40 24 44Z"
        stroke="#111111"
        strokeWidth="0.9"
        strokeOpacity="0.35"
      />
      <path
        d="M40 28C39 20 44 14 51 12C51 19 46 25 40 28Z"
        stroke="#111111"
        strokeWidth="0.9"
        strokeOpacity="0.35"
      />
      <path
        d="M28 46C35 47 42 44 46 39C39 38 33 41 28 46Z"
        stroke="#111111"
        strokeWidth="0.9"
        strokeOpacity="0.35"
      />
    </svg>
  );
}
