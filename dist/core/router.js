export class SkillRouter {
    registry;
    constructor(registry) {
        this.registry = registry;
    }
    route(query) {
        const normalized = query.trim().toLowerCase();
        if (!normalized) {
            return undefined;
        }
        return this.registry
            .list()
            .find((skill) => skill.name.toLowerCase() === normalized || normalized.includes(skill.name.toLowerCase()));
    }
}
