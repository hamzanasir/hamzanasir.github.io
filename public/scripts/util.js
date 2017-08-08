'use strict';
/* globals $ */

const has = Object.prototype.hasOwnProperty;

const colors = {
    red: '#d9534f',
    orange: '#ff851b',
    yellow: '#f0ad4e',
    green: '#449d44',
    blue: '#5bc0de',
    purple: '#383294',
    white: '#fff',
    offwhite: '#eee',
    lightgray: '#ccc',
    gray: '#444',
    black: '#222'
};

const digitsOnly = function (e) {
    // Enter or escape exits + updates, multiple lines disallowed
    var keycode = e.keyCode || e.which;
    if (keycode === 13 || keycode === 27) {
        e.preventDefault();
        $(this).focusout().blur();
    }
    return !(keycode != 46 && keycode > 31 && (keycode < 48 || keycode > 57));
};

const graphUtil = {

    /**
     * Converts a list of pipes to a graph data structure that behaves like a set.
     *
     * This assumes that pipe ids are hyphen-separated nodes, e.g. 'av1-av4-mv2'.
     */
    createGraph: function (pipes) {
        var graph = {}, split;

        $.each(pipes, function (id) {
            if (id.indexOf('arrow') === -1) {
                graph[id] = {};
                split = id.split('-');
                $.each(split, function (index, node) {
                    graph[id][node] = true;
                });
            }
        });
        return graph;
    },

    /**
     * Performs a breadth-first search on the graph, checking if nodes (valves)
     * allow passage.
     *
     * Returns a list of pipe ids that are accessible from provided root node
     */
    bfs: function (graph, root, state) {
        var queue, children, i = 0, nodes, self = this;

        queue = this.traverse(root, graph, state, true);
        while (i < queue.length) {
            nodes = graph[queue[i]];
            $.each(nodes, function (node) {
                children = self.traverse(node, graph, state, false);
                queue = queue.concat(self.difference(children, queue));
            });
            i += 1;
        }
        return queue;
    },

    /**
     * By valve type, determines if the valve is open. Used by `bfs`.
     *
     * This is a boolean check for simpler valves, but has more complex logic
     * for e.g. one-way valves.
     */
    isOpen: function (node, neighbors, state) {
        if (node.indexOf('av') > -1 || node.indexOf('mv') > -1) {
            return (node in state && state[node]);
        } else if (node.indexOf('cv') > -1) {
            return !('av1' in neighbors);
        } else if (node.indexOf('fv') > -1 || node.indexOf('bump') > -1) {
            return true;
        } else {
            return true;
        }
    },

    /**
     * Traverses from a given node to all neighbors. Used by `bfs`.
     */
    traverse: function (node, graph, state, isRoot) {
        var self = this, children = [];
        $.each(graph, function (id, neighbors) {
            if (node in neighbors) {
                if (isRoot || self.isOpen(node, neighbors, state)) {
                    children.push(id);
                }
            }
        });
        return children;
    },

    /**
     * Returns the set intersection of two arrays, a & b
     */
    intersection: function (array1, array2) {
        return array1.filter(function (n) {
            return $.inArray(n, array2) != -1;
        });
    },

    /**
     * Returns the set difference of two arrays, a | b
     */
    difference: function (array1, array2) {
        return array1.filter(function (n) {
            return $.inArray(n, array2) == -1;
        });
    }
};