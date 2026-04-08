export class InMemorySkillRegistry {
    skills = new Map();
    register(skill) {
        this.skills.set(skill.name, skill);
    }
    get(name) {
        return this.skills.get(name);
    }
    list() {
        return Array.from(this.skills.values()).sort((a, b) => a.name.localeCompare(b.name));
    }
}
