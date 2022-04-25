export default class JsonService {
    _apiBase = 'ListOfTrees.json';

    async getResponse(id) {
        const uuid = id || 20

        let res = await fetch(`https://ekb-trees-help.ru/api/tree/get/${uuid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        // if(!res.ok){
        //     throw new Error('Aaaaa!!!')
        // }
        res = await res.json();
        // res = Object.values(res);
        return res;
    }

    getTrees = async () => {
        const res = await this.getResponse();
        return [res]
    }

    _transformTree = (tree) => {
        return {
            name: tree.type,
            age: tree.age,
            height: tree.treeHeight,
            geoposition: [tree.latitude, tree.longitude],
            image: tree.image,
            date: tree.additionDate
        }
    }
}
