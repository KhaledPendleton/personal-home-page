module.exports = {
    /**
     * 
     * @param {Array} updates 11ty collection containing project updates
     * @param {Number} projectKey Integer key identifying a project
     * @returns {Array} result collection or empty
     */
    updatesForProject(updates, projectKey) {
        return updates.filter(u => projectKey === u.data.project);
    }
}