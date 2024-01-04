import { createHelia, Helia } from 'helia'
import { useState, useEffect } from 'react'
import { IDBDatastore } from "datastore-idb";
import { IDBBlockstore } from "blockstore-idb";
import { strings } from '@helia/strings'
import { CID } from 'multiformats/cid'


const IpfsComponent = () => {
    const [id, setId] = useState("")
    const [cid, setCid] = useState("")
    const [helia, setHelia] = useState<Helia | null>(null)
    const [isOnline, setIsOnline] = useState(false)
    const [add, setAdd] = useState("")
    const [get, setGet] = useState("")
    const [getVal, setGetVal] = useState("")

    useEffect(() => {
        const init = async () => {
            if (helia) return

            const datastore = new IDBDatastore('datastore')
            const blockstore = new IDBBlockstore('blockstore')

            await datastore.open()
            await blockstore.open()

            const heliaNode = await createHelia({
                datastore: datastore,
                blockstore: blockstore
            })

            const nodeId = heliaNode.libp2p.peerId.toString()
            const nodeIsOnline = heliaNode.libp2p.isStarted()

            setHelia(heliaNode)
            setId(nodeId)
            setIsOnline(nodeIsOnline)
        }

        init()
    }, [helia])

    if (!helia || !id) {
        return <h4>Connecting to IPFS...</h4>
    }

    const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const s = strings(helia)
        const a = async () => {
            const cid = await s.add(add)
            console.log(cid)
            const c = await cid.toString()
            setCid(c)
        }
        a()
        setAdd("")
    }

    const handleGet = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const s = strings(helia)
        const b = async () => {
            setGetVal(await s.get(CID.parse(get)))
        }
        b()
        setGet("")
    }

    return (
        <div>
            <h4 data-test="id">ID: {id.toString()}</h4>
            <h4 data-test="status">Status: {isOnline ? 'Online' : 'Offline'}</h4>
            <br />
            <form onSubmit={handleAdd}>
                <label>
                    Add Text input: <input name="addInput" value={add} onChange={(e) => { setAdd(e.target.value) }} />
                </label>
                <h4 data-test="id">CID: {cid}</h4>
                <input type="submit" value="Submit" />
            </form>
            <br />
            <form onSubmit={handleGet}>
                <label>
                    Get CID input: <input name="addInput" value={get} onChange={(e) => { setGet(e.target.value) }} />
                </label>
                <input type="submit" value="Submit" />
                <h4 data-test="val">Geted Value: {getVal}</h4>
            </form>
        </div>
    )
}

export default IpfsComponent