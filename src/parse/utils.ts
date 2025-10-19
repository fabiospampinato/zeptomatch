
/* IMPORT */

import type {Node} from '../types';

/* MAIN */

const regex = ( source: string ): Node => { // A single node
  const regex = new RegExp ( source, 's' );
  return { regex, children: [] };
};

const alternation = ( children: Node[] ): Node => { // A list of nodes
  return { children };
};

const sequence = (() => { // A tree of nodes

  const pushToLeaves = ( parent: Node, child: Node, handled: Set<Node> ): void => {
    if ( handled.has ( parent ) ) return;
    handled.add ( parent );

    const {children} = parent;
    if ( !children.length ) { // Leaf node
      children.push ( child );
    } else { // Internal node
      for ( let i = 0, l = children.length; i < l; i++ ) {
        pushToLeaves ( children[i], child, handled );
      }
    }
  };

  return ( nodes: Node[] ): Node => {
    if ( !nodes.length ) { // no-op
      return alternation ( [] );
    }

    for ( let i = nodes.length - 1; i >= 1; i-- ) {
      const handled = new Set<Node> ();
      const parent = nodes[i - 1];
      const child = nodes[i];
      pushToLeaves ( parent, child, handled );
    }
    return nodes[0];
  };

})();

/* EXPORT */

export {regex, alternation, sequence};
