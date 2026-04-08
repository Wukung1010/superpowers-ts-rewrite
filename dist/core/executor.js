export class SkillExecutor {
    registry;
    constructor(registry) {
        this.registry = registry;
    }
    async run(name, input = '') {
        const skill = this.registry.get(name);
        if (!skill) {
            return {
                ok: false,
                output: `Skill not found: ${name}`,
            };
        }
        return skill.run({ input });
    }
}
