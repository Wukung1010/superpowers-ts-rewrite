#!/usr/bin/env node
import { InMemorySkillRegistry } from './core/registry.js';
import { SkillExecutor } from './core/executor.js';
import { helloSkill, workflowSkill } from './skills/example.js';
function createRegistry() {
    const registry = new InMemorySkillRegistry();
    registry.register(helloSkill);
    registry.register(workflowSkill);
    return registry;
}
function readOption(args, name) {
    const index = args.indexOf(name);
    if (index === -1 || index + 1 >= args.length) {
        return undefined;
    }
    return args[index + 1];
}
async function main() {
    const args = process.argv.slice(2);
    const command = args[0];
    const registry = createRegistry();
    if (command === 'list') {
        for (const skill of registry.list()) {
            console.log(`${skill.name}\t${skill.description}`);
        }
        return;
    }
    if (command === 'run') {
        const skillName = args[1];
        if (!skillName) {
            console.error('Usage: superpowers-ts run <skill> [--input <text>]');
            process.exitCode = 1;
            return;
        }
        const input = readOption(args, '--input') ?? '';
        const executor = new SkillExecutor(registry);
        const result = await executor.run(skillName, input);
        if (!result.ok) {
            console.error(result.output);
            process.exitCode = 1;
            return;
        }
        console.log(result.output);
        return;
    }
    console.log('Usage: superpowers-ts <list|run>');
    process.exitCode = 1;
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
