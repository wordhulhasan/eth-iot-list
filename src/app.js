App = {
    loading : false,
    contracts: {},

    load : async () => {
        //load app
        console.log("App loading...")
        await App.loadWeb3()
        await App.loadAccount()
        await App.loadContract()
        await App.render()
    },
    

    loadWeb3: async () => {
        if (typeof web3 !== 'undefined') {
          App.web3Provider = web3.currentProvider
          web3 = new Web3(web3.currentProvider)
        } else {
          window.alert("Please connect to Metamask.")
        }
        // Modern dapp browsers...
        if (window.ethereum) {
          window.web3 = new Web3(ethereum)
          try {
            // Request account access if needed
            await ethereum.enable()
            // Acccounts now exposed
            web3.eth.sendTransaction({/* ... */})
          } catch (error) {
            // User denied account access...
          }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
          App.web3Provider = web3.currentProvider
          window.web3 = new Web3(web3.currentProvider)
          // Acccounts always exposed
          web3.eth.sendTransaction({/* ... */})
        }
        // Non-dapp browsers...
        else {
          console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
      },

    loadAccount: async () => {
        // Set the current blockchain account
        App.account = web3.eth.accounts[0]
        web3.eth.defaultAccount = web3.eth.accounts[0]
        console.log(App.account)
    },

    loadContract: async () => {
        const iotList = await $.getJSON('IotList.json')
        App.contracts.IotList = TruffleContract(iotList)
        App.contracts.IotList.setProvider(App.web3Provider)
        
        App.iotList = await App.contracts.IotList.deployed()
    },

    render: async () => {
          if (App.loading){
              return
          }

          App.setLoading(true)

          $('#account').html(App.account)
          await App.renderTransactions()
    
          App.setLoading(false)
          
    },

    renderTransactions: async () => {
            const transactionCount = await App.iotList.transactionCount()
            const $transactionTemplate = $('.transactionTemplate')

            for(var i=1;i<=transactionCount;i++){
                const transaction = await App.iotList.transactions(i)
                const transactionId = transaction[0].toNumber()
                const transactionContent = transaction[1]
                const transactionValue = transaction[2]

                $newTransactionTemplate = $transactionTemplate.clone()
                $newTransactionTemplate.find('.content').html(transactionContent)
                $newTransactionTemplate.find('.value').html(transactionValue)

                $('#completedTransactionList').append($newTransactionTemplate)

                $newTransactionTemplate.show()
            }
    },
    
    setLoading: (boolean) => {
            App.loading = boolean
            const loader = $('#loader')
            const content = $('#content')
            if (boolean) {
            loader.show()
            content.hide()
            } else {
            loader.hide()
            content.show()
            }
    },

    createTransaction: async () => {
        App.setLoading(true)
        const content = $('#newContent').val()
        const value = $('#newValue').val()
        console.log(content)
        console.log(value)
        await App.iotList.createTransaction(content,value)
        window.location.reload()
    },
}



$(()=>{
    $(window).load(() =>{
      App.load()  
    })
})