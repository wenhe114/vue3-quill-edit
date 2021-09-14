/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// declare module 'vue3-quill-edit' {
//   import _Quill from "quill"
//   export let Quill: _Quill
//   import { DefineComponent } from "vue";
//   export const vue3Quill:DefineComponent

//   export function install():any
// }


declare module '*.js'

// declare module '@webpack/vue3-quill-edit/dist/index.js' {
//   import _Quill from "quill"
//   export let Quill: _Quill
//   import { DefineComponent } from "vue";
//   export const vue3Quill:DefineComponent

//   export function install():any
// }

// declare module 'quill-delta' {
//   // 来自fast-diff包的声明文件，需要升级fast-diff到1.2.0
//   export interface CursorInfo {
//       oldRange: { index: number; length: number };
//       newRange: { index: number; length: number };
//   }
//   export interface Delta {
//       Op?: Op;
//       AttributeMap?: AttributeMap;

//       ops: Op[];

//       // constructor(ops?: Op[] | { ops: Op[] }): Delta;

//       insert?(arg: string | object, attributes?: AttributeMap): this;
//       delete?(length: number): this;
//       retain?(length: number, attributes?: AttributeMap): this;
//       push?(newOp: Op): this;
//       chop?(): this;
//       filter?(predicate: (op: Op, index: number) => boolean): Op[];
//       forEach?(predicate: (op: Op, index: number) => void): void;
//       map?<T>(predicate: (op: Op, index: number) => T): T[];
//       partition?(predicate: (op: Op) => boolean): [Op[], Op[]];
//       reduce?<T>(
//           predicate: (accum: T, curr: Op, index: number) => T,
//           initialValue: T
//       ): T;
//       changeLength?(): number;
//       length?(): number;
//       slice?(start?: number, end?: number): Delta;
//       compose?(other: Delta): Delta;
//       concat?(other: Delta): Delta;
//       diff?(other: Delta, cursor?: number | CursorInfo): Delta;
//       eachLine?(
//           predicate: (
//               line: Delta,
//               attributes: AttributeMap,
//               index: number
//           ) => boolean | void,
//           newline?: string
//       ): void;
//       invert?(base: Delta): Delta;

//       transform?(index: number, priority?: boolean): number;
//       transform?(other: Delta, priority?: boolean): Delta;
//       transform?(arg: number | Delta, priority?: boolean): number | Delta;
//       transformPosition?(index: number, priority?: boolean): number;
//   }

//   export interface Op {
//       // only one property out of {insert, delete, retain} will be present
//       insert?: string | object;
//       delete?: number;
//       retain?: number;
//       attributes?: AttributeMap;
//   }

//   export interface AttributeMap {
//       [key: string]: any;
//   }
// }


