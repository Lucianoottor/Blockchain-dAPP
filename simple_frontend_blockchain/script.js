document.addEventListener("DOMContentLoaded", () => {
    // --- Configuração do Contrato ---
    // !!! SUBSTITUA PELO ENDEREÇO DO SEU CONTRATO IMPLANTADO !!!
    const contractAddress = "0xAc241E867Afaa2BC7495b641F18771b42137669B"; // Use o endereço que você me forneceu por último
    const contractABI = [
        {
            inputs: [],
            stateMutability: "nonpayable",
            type: "constructor",
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "uint256",
                    name: "productId",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "address",
                    name: "buyer",
                    type: "address",
                },
                {
                    indexed: false,
                    internalType: "address",
                    name: "seller",
                    type: "address",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "amount",
                    type: "uint256",
                },
            ],
            name: "PaymentSuccessful",
            type: "event",
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "uint256",
                    name: "id",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "string",
                    name: "name",
                    type: "string",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "quantity",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "unitPrice",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "address",
                    name: "seller",
                    type: "address",
                },
            ],
            name: "ProductCreated",
            type: "event",
        },
        {
            inputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            name: "allProductsIds",
            outputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            name: "payments",
            outputs: [
                {
                    internalType: "address",
                    name: "buyer",
                    type: "address",
                },
                {
                    internalType: "uint256",
                    name: "amount",
                    type: "uint256",
                },
                {
                    internalType: "uint256",
                    name: "timestamp",
                    type: "uint256",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "productCount",
            outputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            name: "products",
            outputs: [
                {
                    internalType: "uint256",
                    name: "id",
                    type: "uint256",
                },
                {
                    internalType: "string",
                    name: "name",
                    type: "string",
                },
                {
                    internalType: "uint256",
                    name: "quantity",
                    type: "uint256",
                },
                {
                    internalType: "uint256",
                    name: "unitPrice",
                    type: "uint256",
                },
                {
                    internalType: "address",
                    name: "seller",
                    type: "address",
                },
                {
                    internalType: "bool",
                    name: "isPaid",
                    type: "bool",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "string",
                    name: "_name",
                    type: "string",
                },
                {
                    internalType: "uint256",
                    name: "_quantity",
                    type: "uint256",
                },
                {
                    internalType: "uint256",
                    name: "_unitPrice",
                    type: "uint256",
                },
            ],
            name: "createProduct",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "uint256",
                    name: "_productId",
                    type: "uint256",
                },
            ],
            name: "payForProduct",
            outputs: [],
            stateMutability: "payable",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "uint256",
                    name: "_productId",
                    type: "uint256",
                },
            ],
            name: "calculateTotalPrice",
            outputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "uint256",
                    name: "_productId",
                    type: "uint256",
                },
            ],
            name: "getProduct",
            outputs: [
                {
                    internalType: "string",
                    name: "",
                    type: "string",
                },
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
                {
                    internalType: "address",
                    name: "",
                    type: "address",
                },
                {
                    internalType: "bool",
                    name: "",
                    type: "bool",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "getAllProductIds",
            outputs: [
                {
                    internalType: "uint256[]",
                    name: "",
                    type: "uint256[]",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
    ];

    let web3;
    let userAccount;
    let storeManagerContract;
    let listenersAttached = false; // flag para garantir que os ouvintes sejam adicionados apenas uma vez

    // --- Elementos do DOM ---
    const connectWalletBtn = document.getElementById("connectWalletBtn");
    // const walletAddressDiv = document.getElementById("walletAddress");
    const networkNameDiv = document.getElementById("networkName");

    const createProductBtn = document.getElementById("createProductBtn");
    const productNameInput = document.getElementById("productName");
    const productQuantityInput = document.getElementById("productQuantity");
    const productPriceInput = document.getElementById("productPrice");

    const productPriceEth = document.getElementById("productPriceEth"); // novo elemento
    const totalPriceEth = document.getElementById("totalPriceEth"); // novo elemento

    const getProductBtn = document.getElementById("getProductBtn");
    const calculatePriceBtn = document.getElementById("calculatePriceBtn");
    const productIdQueryInput = document.getElementById("productIdQuery");
    const productDetailsDiv = document.getElementById("productDetails");

    const productIdPayInput = document.getElementById("productIdPay");
    const paymentStatusDiv = document.getElementById("paymentStatus");

    const errorMessagesDiv = document.getElementById("errorMessages");
    const eventNotificationsContainer = document.getElementById(
        "eventNotificationsContainer"
    );

    const productListDiv = document.getElementById("productList"); // Para produtos disponíveis (não pagos)
    const allProductListDiv = document.getElementById("allProductList");
    const availableProductsContainer = document.querySelector('.available_products_container');
    const allProductsContainer = document.querySelector('.all_products_container');
    const consultProductContainer = document.querySelector('.consult_product_container');

    // --- Funções Auxiliares ---
    function showError(message) {
        errorMessagesDiv.innerHTML = `Erro: ${message}`;
        errorMessagesDiv.classList.remove("hidden");
        console.error(message);
        setTimeout(() => {
            errorMessagesDiv.classList.add("hidden");
            errorMessagesDiv.innerHTML = "";
        }, 7000);
    }

    function showProductDetails(details) {
        productDetailsDiv.innerHTML = details;
        productDetailsDiv.classList.remove("hidden");
    }

    function showPaymentStatus(message) {
        paymentStatusDiv.textContent = message;
        paymentStatusDiv.classList.remove("hidden");
        setTimeout(() => paymentStatusDiv.classList.add("hidden"), 7000);
    }

    function showEventNotification(message, type = "info") {
        const notification = document.createElement("div");
        notification.className = "eventNotification";
        notification.textContent = message;
        if (type === "success") {
            notification.style.backgroundColor = "#d4edda";
            notification.style.color = "#155724";
        } else {
            // info
            notification.style.backgroundColor = "#d1ecf1";
            notification.style.color = "#0c5460";
        }
        eventNotificationsContainer.appendChild(notification);
        setTimeout(() => notification.remove(), 7000);
    }

    function setButtonsDisabled(disabled) {
        if (createProductBtn) {
            createProductBtn.disabled = disabled;
        } else {
            console.error("ERRO: Elemento createProductBtn não encontrado!");
        }

        // desabilitar/habilitar inputs também
        if (productNameInput) productNameInput.disabled = disabled;
        if (productQuantityInput) productQuantityInput.disabled = disabled;
        if (productPriceInput) productPriceInput.disabled = disabled;
        if (productIdQueryInput) productIdQueryInput.disabled = disabled;
        if (getProductBtn) {
            getProductBtn.disabled = disabled;
        } else {
            console.error("ERRO: Elemento getProductBtn não encontrado!");
        }

        if (calculatePriceBtn) {
            calculatePriceBtn.disabled = disabled;
        } else {
            console.error("ERRO: Elemento calculatePriceBtn não encontrado!");
        }

        // if (payProductBtn) { // REMOVA OU COMENTE ESTE BLOCO INTEIRO
        //     payProductBtn.disabled = disabled;
        // } else {
        //     console.error("ERRO: Elemento payProductBtn (estático) não encontrado!");
        // }
    }

    function updateConsultContainerPadding() {
        if (availableProductsContainer && allProductsContainer && consultProductContainer) {
            if (!availableProductsContainer.classList.contains('hidden') || !allProductsContainer.classList.contains('hidden')) {
                // se pelo menos um container de lista estiver visivel
                consultProductContainer.style.paddingBottom = '0';
            } else {
                // se nenhum container de lista estiver visivel
                consultProductContainer.style.paddingBottom = '30px'; // padding original
            }
        } else {
             console.warn("updateConsultContainerPadding: containers nao encontrados.");
        }
    }

    function updatePricesEth() {
        if (!web3) {
            // web3 não inicializado, não fazemos nada ainda.
            if (productPriceEth) productPriceEth.textContent = 'Preço Unitário: 0.000000000000000000 ETH'; // mostrar 0 com 18 casas decimais e rótulo
            if (totalPriceEth) totalPriceEth.textContent = 'Preço Total: 0.000000000000000000 ETH'; // mostrar 0 com 18 casas decimais e rótulo
            return;
        }

        const quantity = parseFloat(productQuantityInput.value);
        const unitPriceWei = productPriceInput.value;

        if (isNaN(quantity) || quantity <= 0 || !unitPriceWei || unitPriceWei.trim() === '') {
            // inputs inválidos, mostrar 0 ETH com 18 casas decimais e rótulo
            if (productPriceEth) productPriceEth.textContent = 'Preço Unitário: 0.000000000000000000 ETH';
            if (totalPriceEth) totalPriceEth.textContent = 'Preço Total: 0.000000000000000000 ETH';
            return;
        }

        try {
            // converter preço unitário para ETH
            const unitPriceEth = web3.utils.fromWei(unitPriceWei, 'ether');
            if (productPriceEth) productPriceEth.textContent = `Preço Unitário: ${parseFloat(unitPriceEth).toFixed(18)} ETH`; // exibir com 18 casas decimais e rótulo

            // calcular preço total em ETH
            const totalPriceEthValue = quantity * parseFloat(unitPriceEth);
            if (totalPriceEth) totalPriceEth.textContent = `Preço Total: ${totalPriceEthValue.toFixed(18)} ETH`; // exibir com 18 casas decimais e rótulo

        } catch (error) {
            // em caso de erro na conversão (ex: valor wei inválido), mostrar inválido
            console.error("Erro ao converter WEI para ETH ou calcular total:", error);
             if (productPriceEth) productPriceEth.textContent = 'Preço Unitário: Inválido';
             if (totalPriceEth) totalPriceEth.textContent = 'Preço Total: Inválido';
        }
    }

    // --- Lógica de Conexão e Contrato ---
    async function connectWallet() {
        if (typeof window.ethereum !== "undefined") {
            // verifica se a carteira já está conectada e ouvintes anexados
            if (userAccount && listenersAttached) {
                console.log("carteira já conectada e ouvintes anexados. ignorando.");
                return;
            }

            web3 = new Web3(window.ethereum);
            try {
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                userAccount = accounts[0];

                const networkId = await web3.eth.net.getId();
                let networkName = "Desconhecida";
                if (networkId === 1) networkName = "Mainnet";
                else if (networkId === 3) networkName = "Ropsten";
                else if (networkId === 4) networkName = "Rinkeby";
                else if (networkId === 5) networkName = "Goerli";
                else if (networkId === 42) networkName = "Kovan";
                else if (networkId === 1337 || networkId === 5777)
                    networkName = "Local (Ganache/Develop)"; // Common Ganache/local IDs
                networkNameDiv.textContent = `Rede: ${networkName} (ID: ${networkId})`;

                // walletAddressDiv.textContent = `Carteira Conectada: ${userAccount.substring(
                //     0,
                //     6
                // )}...${userAccount.substring(userAccount.length - 4)}`;

                connectWalletBtn.textContent = "Carteira Conectada";
                connectWalletBtn.disabled = true;

                storeManagerContract = new web3.eth.Contract(
                    contractABI,
                    contractAddress
                );
                setButtonsDisabled(false);
                // marca como adicionado antes de chamar listenToEvents
                listenersAttached = true;
                // chama listenToEvents apenas após conectar e inicializar o contrato
                listenToEvents();

                // mostrar containers de produtos
                availableProductsContainer.classList.remove('hidden');
                allProductsContainer.classList.remove('hidden');
                updateConsultContainerPadding();

                await loadAndDisplayProducts();
                await loadAndDisplayAllProducts();
            } catch (error) {
                showError("Falha ao conectar carteira: " + (error.message || error));
                // walletAddressDiv.textContent = "Falha ao conectar. Por favor, tente novamente.";
                setButtonsDisabled(true);

                // ocultar containers de produtos
                availableProductsContainer.classList.add('hidden');
                allProductsContainer.classList.add('hidden');
                updateConsultContainerPadding();
            }
        } else {
            showError("MetaMask não detectado! Por favor, instale a MetaMask.");
            // walletAddressDiv.textContent = "MetaMask não encontrado.";
            setButtonsDisabled(true);

            // ocultar containers de produtos
            availableProductsContainer.classList.add('hidden');
            allProductsContainer.classList.add('hidden');
            updateConsultContainerPadding();
        }
    }

    // --- Funções do Contrato ---
    async function handleCreateProduct() {
        if (!storeManagerContract || !userAccount) {
            showError("Carteira não conectada ou contrato não inicializado.");
            return;
        }
        const name = productNameInput.value;
        const quantity = productQuantityInput.value;
        const unitPrice = productPriceInput.value;

        if (!name || !quantity || !unitPrice) {
            showError("Todos os campos para criar produto são obrigatórios.");
            return;
        }

        showEventNotification(
            `Criando produto... Por favor, aguarde a confirmação da transação.`,
            "info"
        );
        try {
            const receipt = await storeManagerContract.methods
                .createProduct(name, quantity, unitPrice)
                .send({ from: userAccount });
            showEventNotification(
                `Produto ${name} criado com sucesso! Hash: ${receipt.transactionHash}`,
                "success"
            );
            productNameInput.value = "";
            productQuantityInput.value = "";
            productPriceInput.value = "";

            // atualizar listas após a criação bem-sucedida
            await loadAndDisplayProducts();
            await loadAndDisplayAllProducts();

        } catch (error) {
            showError(`Erro ao criar produto: ${error.message || (error.data ? error.data.message : error)}`);
        }
    }

    async function handleGetProduct() {
        if (!storeManagerContract) {
            // userAccount not needed for .call() but good to check contract
            showError("Contrato não inicializado. Conecte a carteira.");
            return;
        }
        const productId = productIdQueryInput.value;
        if (!productId) {
            showError("ID do produto para consulta é obrigatório.");
            return;
        }

        try {
            // Web3.js returns struct results as an object with indexed keys
            // and named keys if names are present in ABI outputs. Our ABI has empty names for outputs.
            const product = await storeManagerContract.methods
                .getProduct(productId)
                .call();

            if (!product || product[0] === "") {
                // Check if name (product[0]) is empty
                showProductDetails(`Produto com ID ${productId} não encontrado, nome vazio, ou dados inválidos.`);
                return;
            }
            showProductDetails(
                `Detalhes do Produto (ID: ${productId}):<br>
                 Nome: ${product[0]}<br>
                 Quantidade: ${product[1]}<br>
                 Preço Unitário: ${web3.utils.fromWei(
                    product[2],
                    "ether"
                )} ETH (${product[2]} Wei)<br>
                 Vendedor: ${product[3]}<br>
                 Pago: ${product[4] ? "Sim" : "Não"}`
            );
        } catch (error) {
            // Web3.js often includes reason in error.data.message or error.message for reverts
            let readableError = error.message;
            if (error.data && error.data.message) {
                readableError = error.data.message;
            } else if (
                error.message &&
                error.message.toLowerCase().includes("product does not exist")
            ) {
                showProductDetails(`Produto com ID ${productId} não encontrado (contrato reverteu).`);
                return;
            } else if (
                error.message &&
                error.message.toLowerCase().includes("call revert exception")
            ) {
                readableError = "A chamada ao contrato falhou (revert). Verifique o console para detalhes e se o ID do produto existe.";
            }

            showError(`Erro ao buscar produto: ${readableError}`);
            console.error("Detalhes do erro em handleGetProduct:", error);
        }
    }

    async function handleCalculatePrice() {
        if (!storeManagerContract) {
            showError("Contrato não inicializado. Conecte a carteira.");
            return;
        }
        const productId = productIdQueryInput.value;
        if (!productId) {
            showError("ID do produto para cálculo de preço é obrigatório.");
            return;
        }

        try {
            const totalPrice = await storeManagerContract.methods
                .calculateTotalPrice(productId)
                .call();
            showProductDetails(
                `Preço Total para o Produto (ID: ${productId}): ${web3.utils.fromWei(
                    totalPrice,
                    "ether"
                )} ETH (${totalPrice} Wei)`
            );
        } catch (error) {
            let readableError = error.message;
            if ( error.message && error.message.toLowerCase().includes("product does not exist") ) {
                showProductDetails(
                    `Produto com ID ${productId} não encontrado para cálculo (contrato reverteu).`
                );
                return;
            } else if ( error.message && error.message.toLowerCase().includes("call revert exception") ) {
                readableError = "A chamada ao contrato falhou (revert). Verifique se o ID do produto existe.";
            }
            showError(`Erro ao calcular preço: ${readableError}`);
        }
    }

    async function handlePayProduct() {
        if (!storeManagerContract || !userAccount) {
            showError("Carteira não conectada ou contrato não inicializado.");
            return;
        }
        const productId = productIdPayInput.value;
        if (!productId) {
            showError("ID do produto para pagamento é obrigatório.");
            return;
        }

        showPaymentStatus(`Processando pagamento...`);
        try {
            const productInfo = await storeManagerContract.methods
                .getProduct(productId)
                .call();
            if (!productInfo || productInfo[0] === "") {
                showError( `Produto com ID ${productId} não encontrado para pagamento.` );
                showPaymentStatus("");
                return;
            }
            if (productInfo[4]) {
                // isPaid
                showError(`Produto com ID ${productId} já foi pago.`);
                showPaymentStatus("");
                return;
            }

            const totalPrice = await storeManagerContract.methods
                .calculateTotalPrice(productId)
                .call();
            if (totalPrice.toString() === "0") {
                showError("Preço do produto é zero ou produto não encontrado. Não é possível pagar.");
                showPaymentStatus("");
                return;
            }

            const receipt = await storeManagerContract.methods
                .payForProduct(productId)
                .send({ from: userAccount, value: totalPrice });
            showPaymentStatus(
                `Produto (ID: ${productId}) pago com sucesso! Valor: ${web3.utils.fromWei(
                    totalPrice,
                    "ether"
                )} ETH. Hash: ${receipt.transactionHash}`
            );

            // atualizar listas após o pagamento bem-sucedido
            await loadAndDisplayProducts();
            await loadAndDisplayAllProducts();

            productIdPayInput.value = "";
        } catch (error) {
            let readableError = error.message;
            if (error.data && error.data.message && error.data.message.toLowerCase().includes("product does not exist")) {
                readableError = `Erro ao pagar: Produto com ID ${productId} não encontrado.`;
            } else if ( error.data && error.data.message && error.data.message.toLowerCase().includes("product already paid for")) {
                readableError = `Erro ao pagar: Produto com ID ${productId} já foi pago.`;
            } else if ( error.data &&error.data.message &&error.data.message.toLowerCase().includes("incorrect payment amount")) {
                readableError = `Erro ao pagar: Valor do pagamento incorreto para o produto ID ${productId}.`;
            }
            showError(`Erro ao pagar produto: ${readableError}`);
            showPaymentStatus("");
            console.error("Erro em handlePayProduct:", error);
        }
    }

    async function loadAndDisplayAllProducts() {
        console.log("--- loadAndDisplayAllProducts: FUNÇÃO INICIADA ---");
        console.log(`loadAndDisplayAllProducts: Chamada em: ${new Date().toISOString()}`);

        if (!storeManagerContract) {
            console.warn("loadAndDisplayAllProducts: Contrato não inicializado ou carteira não conectada.");
            if (allProductListDiv) {
                 allProductListDiv.innerHTML = '<p>Conecte a carteira para carregar todos os produtos.</p>';
            } else {
                console.error("loadAndDisplayAllProducts: ERRO CRÍTICO - allProductListDiv é null!");
            }
            return;
        }

        if (!allProductListDiv) {
            console.error("loadAndDisplayAllProducts: ERRO CRÍTICO - allProductListDiv não foi encontrado no DOM! Verifique o ID 'allProductList' no HTML.");
            return;
        }

        // limpa a lista antes de adicionar novos produtos de forma mais robusta
        while (allProductListDiv.firstChild) {
            allProductListDiv.removeChild(allProductListDiv.firstChild);
        }
        console.log("loadAndDisplayAllProducts: allProductListDiv limpo.");

        try {
            const productIds = await storeManagerContract.methods.getAllProductIds().call();
            console.log("loadAndDisplayAllProducts: IDs dos Produtos Recebidos:", JSON.stringify(productIds));

            if (!productIds || productIds.length === 0) {
                allProductListDiv.innerHTML = '<p>Nenhum produto cadastrado na loja.</p>';
                console.log("loadAndDisplayAllProducts: Nenhum ID de produto encontrado. Exibindo mensagem e saindo.");
                updateConsultContainerPadding();
                return;
            }

            // usa um Set para garantir que não haja duplicação de IDs
            const uniqueProductIds = [...new Set(productIds)];
            console.log("loadAndDisplayAllProducts: IDs Únicos a serem processados:", JSON.stringify(uniqueProductIds));

            let productsEffectivelyFound = 0;

            for (const id of uniqueProductIds) {
                console.log(`loadAndDisplayAllProducts: Iterando - Processando ID: ${id}`);
                try {
                    const product = await storeManagerContract.methods.getProduct(id).call();
                    console.log(`--- Detalhes (Todos) para Produto ID: ${id}, Pago: ${product ? product[4] : 'N/A'} ---`);

                    if (product && product[0] !== "") {
                        productsEffectivelyFound++;
                        const productBox = document.createElement('div');
                        productBox.className = 'product-box';
                        const productPriceEth = web3.utils.fromWei(product[2].toString(), 'ether');

                        productBox.innerHTML = `
                            <h3>${product[0]} (ID: ${id})</h3>
                            <p><strong>Quantidade:</strong> ${product[1]}</p>
                            <p><strong>Preço Unitário:</strong> ${productPriceEth} ETH (${product[2].toString()} Wei)</p>
                            <p><strong>Vendedor:</strong> ${product[3].substring(0,6)}...${product[3].substring(product[3].length - 4)}</p>
                            <p><strong>Status:</strong> ${product[4] ? 'Pago ✅' : 'Disponível 🛒'}</p>
                        `;
                        console.log(`loadAndDisplayAllProducts: Adicionando produto ID ${id} à lista.`);
                        allProductListDiv.appendChild(productBox);
                    } else if (product) {
                        console.log(`loadAndDisplayAllProducts: Produto ID: ${id} - Inválido (nome vazio). NÃO EXIBINDO.`);
                    } else {
                        console.warn(`loadAndDisplayAllProducts: Produto ID: ${id} - Não foi possível carregar os detalhes.`);
                    }
                } catch (error) {
                    console.error(`loadAndDisplayAllProducts: Erro ao buscar detalhes do produto com ID ${id}:`, error);
                    const errorBox = document.createElement('div');
                    errorBox.className = 'product-box';
                    errorBox.innerHTML = `<p style="color:red;">Erro ao carregar produto ID ${id}.</p>`;
                    allProductListDiv.appendChild(errorBox);
                }
            }

            if (productsEffectivelyFound === 0 && uniqueProductIds.length > 0) {
                allProductListDiv.innerHTML = '<p>Nenhum produto válido encontrado (verifique o console para detalhes de erros por ID).</p>';
            }

            console.log("--- loadAndDisplayAllProducts: FUNÇÃO CONCLUÍDA ---");
            updateConsultContainerPadding();

        } catch (error) {
            showError("Erro ao carregar a lista de todos os produtos: " + (error.message || error));
            if (allProductListDiv) allProductListDiv.innerHTML = '<p>Erro ao carregar todos os produtos. Tente novamente.</p>';
            console.error("loadAndDisplayAllProducts: Erro principal na função:", error);
            updateConsultContainerPadding();
        }
    }

    async function loadAndDisplayProducts() {
        if (!storeManagerContract) {
            console.warn("loadAndDisplayProducts: Contrato não inicializado ou carteira não conectada. Saindo da função.");
            if (productListDiv) { // Tenta atualizar a UI mesmo se sair cedo
                 productListDiv.innerHTML = '<p>Conecte a carteira para carregar os produtos.</p>';
            } else {
                console.error("loadAndDisplayProducts: ERRO CRÍTICO - productListDiv é null e o contrato não está inicializado!");
            }
            return;
        }

        // Verifica se productListDiv existe, pois é crucial para o restante da função
        if (!productListDiv) {
            console.error("loadAndDisplayProducts: ERRO CRÍTICO - productListDiv não foi encontrado no DOM! Verifique o ID 'productList' no HTML.");
            return; // Não podemos continuar sem este elemento
        }

        productListDiv.innerHTML = '<p>Carregando produtos disponíveis...</p>';

        try {
            const productIds = await storeManagerContract.methods.getAllProductIds().call();

            if (!productIds || productIds.length === 0) {
                productListDiv.innerHTML = '<p>Nenhum produto disponível.</p>';
                availableProductsContainer.classList.add('hidden');
                console.log("loadAndDisplayProducts: Nenhum ID de produto encontrado. Exibindo mensagem e saindo.");
                updateConsultContainerPadding();
                return;
            }

            productListDiv.innerHTML = ''; // Limpa a lista

            let unpaidProductsFound = false;

            for (const id of productIds) {
                try {
                    const product = await storeManagerContract.methods.getProduct(id).call();

                    if (product && product[0] !== "" && !product[4]) { // Filtro: produto válido e NÃO pago
                        unpaidProductsFound = true;

                        const productBox = document.createElement('div');
                        productBox.className = 'product-box';
                        const productPriceEth = web3.utils.fromWei(product[2].toString(), 'ether');

                        productBox.innerHTML = `
                            <h3>${product[0]} (ID: ${id})</h3>
                            <p><strong>Quantidade:</strong> ${product[1]}</p>
                            <p><strong>Preço Unitário:</strong> ${productPriceEth} ETH (${product[2].toString()} Wei)</p>
                            <p><strong>Vendedor:</strong> ${product[3].substring(0,6)}...${product[3].substring(product[3].length - 4)}</p>
                            <p><strong>Status:</strong> Disponível 🛒</p>
                        `;

                        const payButton = document.createElement('button');
                        payButton.textContent = `Pagar ${productPriceEth} ETH`;
                        payButton.onclick = async () => {
                           const totalPriceToPay = await storeManagerContract.methods.calculateTotalPrice(id).call();
                           await paySpecificProduct(id, totalPriceToPay.toString());
                        };
                        productBox.appendChild(payButton);
                        productListDiv.appendChild(productBox);
                    }
                } catch (error) {
                    console.error(`loadAndDisplayProducts: Erro ao buscar detalhes do produto com ID ${id}:`, error);
                    const errorBox = document.createElement('div');
                    errorBox.className = 'product-box';
                    errorBox.innerHTML = `<p style="color:red;">Erro ao carregar produto ID ${id}.</p>`;
                    productListDiv.appendChild(errorBox);
                }
            }

            if (!unpaidProductsFound) {
                availableProductsContainer.classList.add('hidden');
                 productListDiv.innerHTML = '<p>Nenhum produto disponível para compra no momento.</p>';
            } else {
                availableProductsContainer.classList.remove('hidden');
            }
            updateConsultContainerPadding();

        } catch (error) {
            showError("Erro ao carregar a lista de produtos: " + (error.message || error));
            if (productListDiv) productListDiv.innerHTML = '<p>Erro ao carregar produtos. Tente novamente.</p>';
            console.error("loadAndDisplayProducts: Erro principal na função:", error);
            updateConsultContainerPadding();
        }
    }

    // Função modificada para pagar um produto específico (chamada pelo botão na lista)
    async function paySpecificProduct(productId, totalPrice) {
        if (!storeManagerContract || !userAccount) {
            showError("Carteira não conectada ou contrato não inicializado.");
            return;
        }
        if (!productId || !totalPrice) {
            showError("ID do produto ou preço total inválido para pagamento.");
            return;
        }

        showPaymentStatus(`Processando pagamento para o produto ID: ${productId}...`);
        try {
            const productInfo = await storeManagerContract.methods
                .getProduct(productId)
                .call();
            if (productInfo[4]) {
                // isPaid
                showError(`Produto com ID ${productId} já foi pago.`);
                showPaymentStatus("");
                return;
            }

            const receipt = await storeManagerContract.methods
                .payForProduct(productId)
                .send({ from: userAccount, value: totalPrice });

            showPaymentStatus(
                `Produto (ID: ${productId}) pago com sucesso! Valor: ${web3.utils.fromWei(
                    totalPrice,
                    "ether"
                )} ETH. Hash: ${receipt.transactionHash}`
            );

            // atualizar listas após o pagamento bem-sucedido
            await loadAndDisplayProducts();
            await loadAndDisplayAllProducts();

        } catch (error) {
            let readableError = error.message;
            // ... (lógica de tratamento de erro de payForProduct, pode ser refatorada para uma função auxiliar)
            if ( error.data && error.data.message && error.data.message.toLowerCase().includes("product does not exist")) {
                readableError = `Erro ao pagar: Produto com ID ${productId} não encontrado.`;
            } else if ( error.data && error.data.message && error.data.message.toLowerCase().includes("product already paid for")) {
                readableError = `Erro ao pagar: Produto com ID ${productId} já foi pago.`;
            } else if ( error.data && error.data.message && error.data.message.toLowerCase().includes("incorrect payment amount")) {
                readableError = `Erro ao pagar: Valor do pagamento incorreto para o produto ID ${productId}.`;
            }
            showError(`Erro ao pagar produto ID ${productId}: ${readableError}`);
            showPaymentStatus("");
            console.error(`Erro em paySpecificProduct para ID ${productId}:`, error);
        }
    }

    // --- Ouvir Eventos do Contrato ---
    function listenToEvents() {
        if (!storeManagerContract || listenersAttached) return; // verifica se já adicionou

        storeManagerContract.events
            .ProductCreated({ fromBlock: "latest" })
            .on("data", async (event) => {
                console.log("--- Evento ProductCreated Recebido ---");
                console.log("Evento ProductCreated:", event.returnValues);
                const { id, name, unitPrice } = event.returnValues;
                // ao criar um produto, apenas atualiza as listas
                await loadAndDisplayProducts();
                await loadAndDisplayAllProducts();
            })
            .on("error", (error) => {
                console.error("Erro ao ouvir ProductCreated:", error);
                showError("Erro ao ouvir evento ProductCreated do contrato.");
            });

        storeManagerContract.events
            .PaymentSuccessful({ fromBlock: "latest" })
            .on("data", async (event) => {
                console.log("--- Evento PaymentSuccessful Recebido ---");
                console.log("Evento PaymentSuccessful:", event.returnValues);
                const { productId, buyer, amount } = event.returnValues;
                showEventNotification(
                    `Pagamento Recebido! Produto ID: ${productId}, Comprador: ${buyer.substring(
                        0,
                        6
                    )}..., Valor: ${web3.utils.fromWei(amount, "ether")} ETH`,
                    "success"
                );
                // ao pagar um produto, atualiza as listas
                await loadAndDisplayProducts();
                await loadAndDisplayAllProducts();
            })
            .on("error", (error) => {
                console.error("Erro ao ouvir PaymentSuccessful:", error);
                showError("Erro ao ouvir evento PaymentSuccessful do contrato.");
            });

        listenersAttached = true; // marca como adicionado
    }

    // --- Adicionar Event Listeners aos Botões ---
    connectWalletBtn.addEventListener("click", connectWallet);
    createProductBtn.addEventListener("click", handleCreateProduct);
    getProductBtn.addEventListener("click", handleGetProduct);
    calculatePriceBtn.addEventListener("click", handleCalculatePrice);

    // Adicionar event listeners para os inputs de quantidade e preço para atualização em tempo real
    if (productQuantityInput) productQuantityInput.addEventListener('input', updatePricesEth);
    if (productPriceInput) productPriceInput.addEventListener('input', updatePricesEth);

    // chamar a função uma vez na inicialização para exibir 0 ETH
    updatePricesEth();

    // Inicialmente desabilitar botões que dependem da conexão da carteira
    setButtonsDisabled(true);
});