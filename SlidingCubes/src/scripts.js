function DFS(root, target=null, postOrder=-1){ //action=null){
    if(target === root){
        // if(action !== null){
        //     action(root);
        // }
        if(postOrder > -1){
            // root.postOrder = 0;
            root.postOrder = postOrder;
        }
        return true;
    }
    
    // if(root.visited === true){
    //     return false;
    // }
    root.visited = true; 

    root.neighbors.forEach(node => {
        if(node == 0){return;}
        if(node.visited){return;}
        DFS(node, target, postOrder+1);        
    });

    // if(action !== null){
    //     action(root);
    // }
    root.postOrder= postOrder;


    return false;
}