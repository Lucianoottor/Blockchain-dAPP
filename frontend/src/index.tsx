// index.tsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, Link, Outlet } from 'react-router-dom';
import Web3, { ContractAbi } from 'web3';
import { Contract } from 'web3-eth-contract';
import './style.css';

// --------------------------------------------------------------------
// ABI e Endereço do Contrato
// --------------------------------------------------------------------

declare global {
  interface Window {
    ethereum?: any;
  }
}

const contractABI: any = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "productId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "buyer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "seller",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "PaymentSuccessful",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "quantity",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "unitPrice",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "seller",
          "type": "address"
        }
      ],
      "name": "ProductCreated",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "allProductsIds",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "payments",
      "outputs": [
        {
          "internalType": "address",
          "name": "buyer",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "productCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "products",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "quantity",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "unitPrice",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "seller",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "isPaid",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_quantity",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_unitPrice",
          "type": "uint256"
        }
      ],
      "name": "createProduct",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_productId",
          "type": "uint256"
        }
      ],
      "name": "payForProduct",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function",
      "payable": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_productId",
          "type": "uint256"
        }
      ],
      "name": "calculateTotalPrice",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_productId",
          "type": "uint256"
        }
      ],
      "name": "getProduct",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getAllProductIds",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    }
  ];

// !! Atenção: use o endereço de contrato correto para a rede onde o usuário estiver!
const contractAddress: string = '0xDC70D775F731471fEd12256fEb22203F293D6309';

interface IWeb3Context {
  web3: Web3 | null;
  contract: Contract<ContractAbi> | null;
  account: string | null;
  connectWallet: () => Promise<void>;
}

export const Web3Context = createContext<IWeb3Context>({} as IWeb3Context);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [contract, setContract] = useState<Contract<ContractAbi> | null>(null);
  const [account, setAccount] = useState<string | null>(null);

  // Se o usuário mudar de rede, recarrega a página (opcional, mas ajuda a forçar rechecagem de context)
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('MetaMask não detectado! Por favor, instale a MetaMask.');
      return;
    }

    try {
      // 1. Solicita permissão de contas ao MetaMask
      const accounts: string[] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const selectedAccount = accounts[0];

      // 2. Cria o Web3 usando o provedor injetado (independente da rede)
      const web3Instance = new Web3(window.ethereum);

      // 3. Instancia o contrato no endereço estático informado (garanta que esse endereço exista na rede ativa)
      const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);

      // 4. Atualiza estado (conta, web3, contrato)
      setAccount(selectedAccount);
      setWeb3(web3Instance);
      setContract(contractInstance);

    } catch (error: any) {
      console.error('Falha ao conectar carteira:', error);
      alert('Falha ao conectar. Por favor, tente novamente.');
    }
  };

  return (
    <Web3Context.Provider value={{ web3, contract, account, connectWallet }}>
      {children}
    </Web3Context.Provider>
  );
};

// ----------------------------
// Página de Conexão (ConnectPage)
// ----------------------------
const ConnectPage: React.FC = () => {
  const { account, connectWallet } = useContext(Web3Context);
  const navigate = useNavigate();

  // Se a conta já estiver definida, redireciona para o dashboard
  useEffect(() => {
    if (account) {
      navigate('/dashboard/create');
    }
  }, [account, navigate]);

  const handleConnect = async () => {
    await connectWallet();
  };

  return (
    <div className="connect-page" style={{ textAlign: 'center', marginTop: '250px'}}>
      <h1>Conectar Carteira</h1>
      <button onClick={handleConnect} className="connect-button">
        Conectar com MetaMask
      </button>
    </div>
  );
};

// ----------------------------
// Formulário de Criação de Produto
// ----------------------------
const CreateProductForm: React.FC = () => {
  const { contract, account, web3 } = useContext(Web3Context);
  const [productName, setProductName] = useState<string>('');
  const [productQuantity, setProductQuantity] = useState<string>('');
  const [productPrice, setProductPrice] = useState<string>('');
  const [unitPriceEth, setUnitPriceEth] = useState<string>('0.000000000000000000');
  const [totalPriceEth, setTotalPriceEth] = useState<string>('0.000000000000000000');

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract || !account) {
      alert('Carteira não conectada ou contrato não inicializado.');
      return;
    }
    if (!productName || !productQuantity || !productPrice) {
      alert('Todos os campos são obrigatórios.');
      return;
    }

    try {
      await contract.methods
        .createProduct(productName, productQuantity, productPrice)
        .send({ from: account });
      alert(`Produto "${productName}" criado com sucesso!`);
      setProductName('');
      setProductQuantity('');
      setProductPrice('');
    } catch (error: any) {
      console.error('Erro ao criar produto:', error);
      const reason = error.data?.message || error.message;
      alert(`Falha ao criar produto: ${reason}`);
    }
  };

  useEffect(() => {
    if (!web3) {
      setUnitPriceEth('0.000000000000000000');
      setTotalPriceEth('0.000000000000000000');
      return;
    }

    const q = parseFloat(productQuantity);
    if (isNaN(q) || q <= 0 || !productPrice) {
      setUnitPriceEth('0.000000000000000000');
      setTotalPriceEth('0.000000000000000000');
      return;
    }

    try {
      const unitEth = web3.utils.fromWei(productPrice, 'ether');
      setUnitPriceEth(parseFloat(unitEth).toFixed(18));
      const totalEth = q * parseFloat(unitEth);
      setTotalPriceEth(totalEth.toFixed(18));
    } catch {
      setUnitPriceEth('Inválido');
      setTotalPriceEth('Inválido');
    }
  }, [productQuantity, productPrice, web3]);

  return (
    <form
      className="create_product_container"
      onSubmit={handleCreateProduct}
      style={{ marginBottom: '30px' }}
    >
      <h2>Criar Produto</h2>
      <div className="primary_inputs">
        <label>Nome do Produto:</label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Ex: Camiseta"
          required
        />
      </div>
      <div className="secondary_inputs">
        <div className="input_1">
          <label>Quantidade:</label>
          <input
            type="number"
            value={productQuantity}
            onChange={(e) => setProductQuantity(e.target.value)}
            placeholder="Ex: 10"
            required
            min="1"
          />
        </div>
        <div className="input_2">
          <label>Preço Unitário (em Wei):</label>
          <input
            type="number"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            placeholder="Ex: 10000000000000000 (0.01 ETH)"
            required
            min="0"
          />
          <p id="productPriceEth">Preço Unitário: {unitPriceEth} ETH</p>
          <p id="totalPriceEth">Preço Total: {totalPriceEth} ETH</p>
        </div>
      </div>
      <button id="createProductBtn" disabled={!account} type="submit">
        Criar Produto
      </button>
    </form>
  );
};

// ----------------------------
// Componente de Busca de Produto por ID
// ----------------------------
const SearchProduct: React.FC = () => {
  const { contract, web3 } = useContext(Web3Context);
  const [queryId, setQueryId] = useState<string>('');
  const [details, setDetails] = useState<string>('');

  const handleGetProduct = async () => {
    if (!contract) {
      alert('Contrato não inicializado.');
      return;
    }
    if (!queryId) {
      alert('ID do produto para consulta é obrigatório.');
      return;
    }

    try {
      const product: any = await contract.methods.getProduct(queryId).call();
      // Caso o contrato retorne um objeto vazio ou sem índices:
      if (!product || product[0] === '' || product[0] === undefined) {
        setDetails(`Produto com ID ${queryId} não encontrado ou inválido.`);
        return;
      }

      // Acessando campo por índice em vez de destructuring de array:
      const name = product[0];
      const quantity = product[1];
      const unitPriceWei = product[2];
      const seller = product[3];
      const isPaid = product[4];

      // Converte Wei para Ether (caso web3 esteja disponível)
      const unitPriceEth = web3 ? web3.utils.fromWei(unitPriceWei, 'ether') : '0';

      setDetails(
        `Detalhes do Produto (ID: ${queryId}):\n` +
          `Nome: ${name}\n` +
          `Quantidade: ${quantity}\n` +
          `Preço Unitário: ${unitPriceEth} ETH (${unitPriceWei} Wei)\n` +
          `Vendedor: ${seller}\n` +
          `Pago: ${isPaid ? 'Sim' : 'Não'}`
      );
    } catch (error: any) {
      console.error('Erro ao buscar produto:', error);
      // Em alguns providers, a mensagem de erro vem em error.data.message
      const reason = error.data?.message || error.message;
      if (typeof reason === 'string' && reason.toLowerCase().includes('product does not exist')) {
        setDetails(`Produto com ID ${queryId} não encontrado (contrato reverteu).`);
      } else {
        setDetails(`Erro ao buscar produto: ${reason}`);
      }
    }
  };

  const handleCalculatePrice = async () => {
    if (!contract) {
      alert('Contrato não inicializado.');
      return;
    }
    if (!queryId) {
      alert('ID do produto para cálculo de preço é obrigatório.');
      return;
    }

    try {
      const totalPriceWei: string = await contract.methods
        .calculateTotalPrice(queryId)
        .call();

      if (totalPriceWei == null) {
        setDetails(`Erro ao calcular preço: valor retornado inválido.`);
        return;
      }

      const totalPriceEth = web3
        ? web3.utils.fromWei(totalPriceWei.toString(), 'ether')
        : '0';

      setDetails(
        `Preço Total para o Produto (ID: ${queryId}): ${totalPriceEth} ETH (${totalPriceWei} Wei)`
      );
    } catch (error: any) {
      console.error('Erro ao calcular preço:', error);
      const reason = error.data?.message || error.message;
      if (
        typeof reason === 'string' &&
        reason.toLowerCase().includes('product does not exist')
      ) {
        setDetails(
          `Produto com ID ${queryId} não encontrado para cálculo (contrato reverteu).`
        );
      } else {
        setDetails(`Erro ao calcular preço: ${reason}`);
      }
    }
  };

  return (
    <div className="consult_product_container" style={{ marginBottom: '30px' }}>
      <h2>Consultar Produto</h2>
      <div className="id_input">
        <label>ID do Produto:</label>
        <input
          type="number"
          value={queryId}
          onChange={(e) => setQueryId(e.target.value)}
          placeholder="Ex: 1"
          min="0"
        />
      </div>
      <div className="buttons_container" style={{ marginBottom : '40px' }}>
        <button id="getProductBtn" onClick={handleGetProduct}>
          Ver Detalhes
        </button>
        <button id="calculatePriceBtn" onClick={handleCalculatePrice}>
          Calcular Preço Total
        </button>
      </div>
      {details && (
        <div
          id="productDetails"
          style={{
            whiteSpace: 'pre-wrap',
            backgroundColor: '#414141',
            padding: '15px',
            borderRadius: '20px',
            marginTop: '10px',
          }}
        >
          {details}
        </div>
      )}
    </div>
  );
};

// ----------------------------
// Componente para Listar Produtos
// ----------------------------
interface Product {
  id: string;
  name: string;
  quantity: string;
  unitPriceWei: string;
  seller: string;
  isPaid: boolean;
}

const ProductList: React.FC<{ type: 'all' | 'available' }> = ({ type }) => {
  const { contract, web3, account } = useContext(Web3Context);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadProducts = useCallback(async () => {
    if (!contract || !web3) {
      return;
    }

    setLoading(true);
    try {
      const result = await contract.methods.getAllProductIds().call();
      const ids: string[] = Array.isArray(result)
        ? (result as (string | number | bigint)[]).map((id) => id.toString())
        : [];

      if (!ids || ids.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      const uniqueIds = Array.from(new Set(ids));
      const fetched: Product[] = [];

      for (const id of uniqueIds) {
        try {
          const prod = await contract.methods.getProduct(id).call();
          if (prod && prod[0] !== '') {
            const isPaid = prod[4];
            if (type === 'all' || (type === 'available' && !isPaid)) {
              fetched.push({
                id,
                name: prod[0],
                quantity: (prod[1] as string | number | bigint)?.toString() || '0',
                unitPriceWei: (prod[2] as string | number | bigint)?.toString() || '0',
                seller: prod[3],
                isPaid: prod[4],
              });
            }
          }
        } catch (err) {
          console.error(`Erro ao buscar produto ID ${id}:`, err);
        }
      }
      setProducts(fetched);
    } catch (error) {
      console.error('Erro ao carregar IDs de produtos:', error);
    }
    setLoading(false);
  }, [contract, web3, type]);

  useEffect(() => {
    if (contract && web3) {
      loadProducts();
    }
  }, [loadProducts, contract, web3]);

  useEffect(() => {
    if (!contract) {
      return;
    }

    const eventHandler = (event: any) => {
      console.log('Novo evento do contrato:', event.event, event.returnValues);
      loadProducts();
    };

    let eventSubscription: any;
    try {
      eventSubscription = contract.events.allEvents({ fromBlock: 'latest' });
      eventSubscription.on('data', eventHandler);
      eventSubscription.on('error', (error: Error) => {
        console.error('Erro na subscrição de eventos (allEvents):', error);
      });
    } catch (e) {
      console.error("Falha ao se inscrever a allEvents. Verifique se o seu contrato emite eventos e se a interface do contrato (ABI) está correta.", e);
    }

    return () => {
      if (eventSubscription) {
        if (typeof eventSubscription.unsubscribe === 'function') {
          eventSubscription.unsubscribe();
        } else if (typeof eventSubscription.removeAllListeners === 'function') {
          eventSubscription.removeAllListeners('data');
          eventSubscription.removeAllListeners('error');
        }
      }
    };
  }, [contract, loadProducts]);

  const handlePay = useCallback(async (productId: string) => {
    if (!contract || !account || !web3) {
      alert('Carteira ou Web3 não disponíveis.');
      return;
    }

    try {
      const totalWeiRaw = await contract.methods.calculateTotalPrice(productId).call();
      const totalWeiStr = totalWeiRaw?.toString ? totalWeiRaw.toString() : '0';

      await contract.methods.payForProduct(productId).send({
        from: account,
        value: totalWeiStr,
      });
      alert(`Produto ID ${productId} pago com sucesso!`);

      // adicione um pequeno delay antes de recarregar a lista
      setTimeout(() => {
        loadProducts();
      }, 750); // espera 3 segundos (ajuste se necessário)

    } catch (error: any) {
      console.error('Erro ao pagar produto:', error);
      let reason = 'Falha ao pagar produto.';
      if (error.data && error.data.message) {
        reason = error.data.message;
      } else if (error.reason) {
        reason = error.reason;
      } else if (error.message) {
        reason = error.message;
      }

      if (reason.includes('execution reverted:')) {
        reason = reason.split('execution reverted:')[1].trim();
      } else if (reason.includes('VM Exception while processing transaction: revert')) {
        reason = reason.split('VM Exception while processing transaction: revert')[1].trim();
      }

      if (reason.toLowerCase().includes('product does not exist')) {
        alert(`Produto com ID ${productId} não encontrado no contrato.`);
      } else if (reason.toLowerCase().includes('product already paid for')) {
        alert(`Produto com ID ${productId} já foi pago.`);
      } else if (reason.toLowerCase().includes('incorrect payment amount')) {
        alert(`Valor de pagamento incorreto para o produto ID ${productId}.`);
      } else if (reason.toLowerCase().includes('user denied transaction') || (error.code && error.code === 4001)) {
        alert('Transação rejeitada pelo usuário.');
      } else {
        alert(`Falha ao pagar produto: ${reason}`);
      }
    }
  }, [contract, account, web3, loadProducts]); // <-- THIS IS THE FIX

  return (
    <div className="product-list-section" style={{ marginBottom: '30px' }}>
      {loading && products.length === 0 && <p>Carregando produtos iniciais...</p>}

      {products.length > 0 ? (
        <div className="scrollable-list-container" style={{ padding: '20px' }}>
          {products.map((prod) => {
            const priceEth = web3 ? web3.utils.fromWei(prod.unitPriceWei, 'ether') : '0';
            return (
              <div className="product-box" key={prod.id} style={{ textAlign: 'center' }}>
                <h3>
                  {prod.name} (ID: {prod.id})
                </h3>
                <p>
                  <strong>Quantidade:</strong> {prod.quantity}
                </p>
                <p>
                  <strong>Preço Unitário:</strong> {priceEth} ETH
                </p>
                <p>
                  <strong>Preço Total:</strong> {web3 ? web3.utils.fromWei((Number(prod.unitPriceWei) * Number(prod.quantity)).toString(), 'ether') : '0'} ETH 
                </p>
                <p>
                  <strong>Vendedor:</strong> {prod.seller.substring(0, 6)}...
                  {prod.seller.substring(prod.seller.length - 4)}
                </p>
                <p>
                  <strong>Status:</strong> {prod.isPaid ? 'Pago ✅' : 'Disponível 🛒'}
                </p>
                {!prod.isPaid && type === 'available' && (
                  <button onClick={() => handlePay(prod.id)} disabled={loading} style={{ borderRadius: '10px', margin: '15px auto', display: 'block'}}>
                    Pagar {web3 ? web3.utils.fromWei((Number(prod.unitPriceWei) * Number(prod.quantity)).toString(), 'ether') : '0'} ETH
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        !loading && (
          <p>
            {type === 'all'
              ? 'Nenhum produto cadastrado.'
              : 'Nenhum produto disponível no momento.'}
          </p>
        )
      )}
      {/* {loading && products.length > 0 && <p>Atualizando lista de produtos...</p>} */}
    </div>
  );
};

// ----------------------------
// Layout com Navbar para Dashboard
// ----------------------------
const DashboardLayout: React.FC = () => {
  const { account } = useContext(Web3Context);
  const navigate = useNavigate();

  // Se não estiver logado, redireciona para a página de conexão
  useEffect(() => {
    if (!account) {
      navigate('/');
    }
  }, [account, navigate]);

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar" style={{ backgroundColor: 'var(--secondary-bg)', padding: '10px 20px' }}>
        <ul style={{ listStyle: 'none', display: 'flex', gap: '40px', margin: 0 }}>
          <li>
            <Link to="/dashboard/create" style={{ color: 'var(--text-color)', textDecoration: 'none' }}>
              Criar Produto
            </Link>
          </li>
          <li>
            <Link to="/dashboard/search" style={{ color: 'var(--text-color)', textDecoration: 'none' }}>
              Buscar Produto
            </Link>
          </li>
          <li>
            <Link to="/dashboard/available" style={{ color: 'var(--text-color)', textDecoration: 'none' }}>
              Produtos Disponíveis
            </Link>
          </li>
          <li>
            <Link to="/dashboard/all" style={{ color: 'var(--text-color)', textDecoration: 'none' }}>
              Todos os Produtos
            </Link>
          </li>
        </ul>
      </nav>

      {/* Onde cada rota filha será renderizada */}
      <Outlet />
    </div>
  );
};

// ----------------------------
// Páginas Separadas
// ----------------------------
const CreateProductPage: React.FC = () => (
  <div className="dashboard" style={{ padding: '20px' }}>
    <CreateProductForm />
  </div>
);

const SearchProductPage: React.FC = () => (
  <div className="dashboard" style={{ padding: '20px' }}>
    <SearchProduct />
  </div>
);

const AvailableProductsPage: React.FC = () => (
  <div className="dashboard" style={{ padding: '20px' }}>
    <div className="available_products_container">
      <h2>Produtos Disponíveis</h2>
      <ProductList type="available" />
    </div>
  </div>
);

const AllProductsPage: React.FC = () => (
  <div className="dashboard" style={{ padding: '20px' }}>
    <div className="all_products_container">
      <h2>Todos os Produtos</h2>
      <ProductList type="all" />
    </div>
  </div>
);

// ----------------------------
// Componente Principal com Rotas
// ----------------------------
const App: React.FC = () => (
  <Routes>
    <Route path="/" element={<ConnectPage />} />

    {/* Todas as rotas que começam com /dashboard/ passam pelo DashboardLayout */}
    <Route path="/dashboard" element={<DashboardLayout />}>
      {/* Se acessarem apenas /dashboard, redireciona automaticamente para /dashboard/create */}
      <Route index element={<Navigate to="create" replace />} />

      <Route path="create" element={<CreateProductPage />} />
      <Route path="search" element={<SearchProductPage />} />
      <Route path="available" element={<AvailableProductsPage />} />
      <Route path="all" element={<AllProductsPage />} />
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

// ----------------------------
// Renderiza a Aplicação
// ----------------------------
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <Web3Provider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Web3Provider>
  </React.StrictMode>
);
