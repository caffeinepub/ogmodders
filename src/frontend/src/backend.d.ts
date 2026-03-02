import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Mod {
    id: bigint;
    title: string;
    tags: Array<string>;
    description: string;
    downloadUrl: string;
    author: string;
    category: string;
    image: string;
}
export interface backendInterface {
    addMod(title: string, category: string, author: string, tags: Array<string>, image: string, description: string, downloadUrl: string): Promise<bigint>;
    deleteMod(id: bigint): Promise<boolean>;
    getMods(): Promise<Array<Mod>>;
    updateMod(id: bigint, title: string, category: string, author: string, tags: Array<string>, image: string, description: string, downloadUrl: string): Promise<boolean>;
}
