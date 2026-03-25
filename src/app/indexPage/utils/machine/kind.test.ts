import { describe, expect, it } from "@jest/globals";
import { inferMachineKind } from "./kind";

describe("inferMachineKind", () => {
	it("classifica por palavras-chave no código", () => {
		expect(inferMachineKind("Torno CNC 101")).toBe("Torno");
		expect(inferMachineKind("Fresadora X")).toBe("Fresadora");
		expect(inferMachineKind("Retífica Z")).toBe("Retifica");
		expect(inferMachineKind("Centro de Usinagem Y")).toBe("Centro de Usinagem");
		expect(inferMachineKind("Linha genérica")).toBe("Outros");
	});
});
