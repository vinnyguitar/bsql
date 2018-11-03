
export interface BsqlConfig {
    caseTransform: boolean
}
export function config(conf: BsqlConfig) {
    Object.assign(configObject, conf);
}
export function getConfig() {
    return configObject;
}
const configObject = {
    caseTransform: true
};