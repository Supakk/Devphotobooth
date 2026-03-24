/**
 * TEMPLATES CONFIG
 * ════════════════
 * นี่คือไฟล์เดียวที่ต้องแก้เมื่อต้องการเพิ่ม / แก้ไข template
 *
 * วิธีเพิ่ม Template ใหม่
 * ───────────────────────
 * 1. วาง frame PNG ลงใน /public/imagelayout/
 * 2. เพิ่ม object ลงใน templates[] ของ group ที่ต้องการ
 *    (หรือเพิ่ม group ใหม่ตามรูปแบบด้านล่าง)
 *
 * วิธีหา slot coordinates
 * ───────────────────────
 * เปิด PNG ใน Figma / Photoshop แล้วอ่านค่า X, Y, W, H ของ
 * แต่ละช่องที่ต้องการวางรูป (หน่วย: pixel ตาม natural size ของ PNG)
 *
 * กฎที่ต้องตรวจก่อน commit:
 *   slot.left + slot.width  ≤ width
 *   slot.top  + slot.height ≤ height
 *
 * รูปแบบ Template Object
 * ──────────────────────
 * {
 *   id:     string   — unique เช่น 'mychar-1'
 *   name:   string   — ชื่อที่แสดงใน UI
 *   image:  string   — path ใต้ /public เช่น '/imagelayout/MyChar1.png'
 *   width:  number   — ความกว้าง canvas (px)
 *   height: number   — ความสูง canvas (px)
 *   slots:  Array<{ top, left, width, height }>  — ช่องวางรูปแต่ละช่อง (px)
 * }
 *
 * รูปแบบ Group Object
 * ───────────────────
 * {
 *   id:        string   — unique เช่น 'my-character'
 *   label:     string   — ชื่อที่แสดงเป็น group (ยังไม่ได้ใช้ใน UI ปัจจุบัน)
 *   templates: Template[]
 * }
 */

export const TEMPLATE_GROUPS = [

  // ── Group 1: Badtz-Maru ───────────────────────────────────────────────────
  {
    id: 'badtz-maru',
    label: 'Badtz-Maru',
    templates: [
      {
        id: 'layout1-1',
        name: 'Badtz-Maru 1',
        image: '/imagelayout/Badtz-Maru1-1.png',
        width: 105.5, height: 310,
        slots: [
          { top: 15.5,  left: 17, width: 71, height: 71 },
          { top: 110.5, left: 17, width: 72, height: 72 },
          { top: 205.5, left: 17, width: 71, height: 71 },
        ],
      },
      {
        id: 'layout1-2',
        name: 'Badtz-Maru 2',
        image: '/imagelayout/Badtz-Maru1-2.png',
        width: 190, height: 310,
        slots: [
          { top: 8,   left: 12,   width: 72,    height: 72 },
          { top: 124, left: 12,   width: 159.5, height: 81 },
          { top: 225, left: 11.5, width: 72,    height: 72 },
          { top: 225, left: 101,  width: 72,    height: 72 },
        ],
      },
      {
        id: 'layout1-3',
        name: 'Badtz-Maru 3',
        image: '/imagelayout/Badtz-Maru1-3.png',
        width: 190, height: 310,
        slots: [
          { top: 15,  left: 8,   width: 82, height: 130 },
          { top: 15,  left: 100, width: 82, height: 130 },
          { top: 160, left: 8,   width: 82, height: 130 },
          { top: 160, left: 100, width: 82, height: 130 },
        ],
      },
      {
        id: 'layout1-4',
        name: 'Badtz-Maru 4',
        image: '/imagelayout/Badtz-Maru1-4.png',
        width: 105.5, height: 290,
        slots: [
          { top: 13,    left: 16, width: 70, height: 70 },
          { top: 88.5,  left: 16, width: 70, height: 70 },
          { top: 162.5, left: 16, width: 70, height: 70 },
        ],
      },
    ],
  },

  // ── Group 2: Pochacco ─────────────────────────────────────────────────────
  {
    id: 'pochacco',
    label: 'Pochacco',
    templates: [
      {
        id: 'layout2-1',
        name: 'Pochacco 1',
        image: '/imagelayout/Pochacco2-1.png',
        width: 105.5, height: 290,
        slots: [
          { top: 15.5,  left: 17, width: 71, height: 71 },
          { top: 110.5, left: 17, width: 72, height: 72 },
          { top: 205.5, left: 17, width: 71, height: 71 },
        ],
      },
      {
        id: 'layout2-2',
        name: 'Pochacco 2',
        image: '/imagelayout/Pochacco2-2.png',
        width: 190, height: 310,
        slots: [
          { top: 8,   left: 13,   width: 72,    height: 72 },
          { top: 124, left: 12,   width: 159.5, height: 81 },
          { top: 225, left: 11.5, width: 72,    height: 72 },
          { top: 225, left: 101,  width: 72,    height: 72 },
        ],
      },
      {
        id: 'layout2-3',
        name: 'Pochacco 3',
        image: '/imagelayout/Pochacco2-3.png',
        width: 190, height: 310,
        slots: [
          { top: 15,  left: 8,   width: 82, height: 130 },
          { top: 15,  left: 100, width: 82, height: 130 },
          { top: 160, left: 8,   width: 82, height: 130 },
          { top: 160, left: 100, width: 82, height: 130 },
        ],
      },
      {
        id: 'layout2-4',
        name: 'Pochacco 4',
        image: '/imagelayout/Pochacco2-4.png',
        width: 105.5, height: 290,
        slots: [
          { top: 13,    left: 16, width: 70, height: 70 },
          { top: 88.5,  left: 16, width: 70, height: 70 },
          { top: 162.5, left: 16, width: 70, height: 70 },
        ],
      },
    ],
  },

  // ── Group 3: Kuromi ───────────────────────────────────────────────────────
  {
    id: 'kuromi',
    label: 'Kuromi',
    templates: [
      {
        id: 'layout3-1',
        name: 'Kuromi 1',
        image: '/imagelayout/Kuromi3-1.png',
        width: 105.5, height: 290,
        slots: [
          { top: 15.5,  left: 17, width: 71, height: 71 },
          { top: 110.5, left: 17, width: 72, height: 72 },
          { top: 205.5, left: 17, width: 71, height: 71 },
        ],
      },
      {
        id: 'layout3-2',
        name: 'Kuromi 2',
        image: '/imagelayout/Kuromi3-2.png',
        width: 190, height: 310,
        slots: [
          { top: 8,   left: 13,   width: 72,    height: 72 },
          { top: 124, left: 12,   width: 159.5, height: 81 },
          { top: 225, left: 11.5, width: 72,    height: 72 },
          { top: 225, left: 101,  width: 72,    height: 72 },
        ],
      },
      {
        id: 'layout3-3',
        name: 'Kuromi 3',
        image: '/imagelayout/Kuromi3-3.png',
        width: 190, height: 310,
        slots: [
          { top: 15,  left: 8,   width: 82, height: 130 },
          { top: 15,  left: 100, width: 82, height: 130 },
          { top: 160, left: 8,   width: 82, height: 130 },
          { top: 160, left: 100, width: 82, height: 130 },
        ],
      },
      {
        id: 'layout3-4',
        name: 'Kuromi 4',
        image: '/imagelayout/Kuromi3-4.png',
        width: 105.5, height: 290,
        slots: [
          { top: 13,    left: 16, width: 70, height: 70 },
          { top: 88.5,  left: 16, width: 70, height: 70 },
          { top: 162.5, left: 16, width: 70, height: 70 },
        ],
      },
    ],
  },

  // ── เพิ่ม Group ใหม่ที่นี่ ─────────────────────────────────────────────────
  // {
  //   id: 'my-character',
  //   label: 'My Character',
  //   templates: [
  //     {
  //       id: 'mychar-1',
  //       name: 'My Character 1',
  //       image: '/imagelayout/MyChar1.png',
  //       width: 190, height: 310,
  //       slots: [
  //         { top: 10, left: 10, width: 170, height: 140 },
  //         { top: 160, left: 10, width: 170, height: 140 },
  //       ],
  //     },
  //   ],
  // },
];
