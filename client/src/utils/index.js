import Azuki from '../assets/azuki-bg.jpeg';
import GasLess from '../assets/gas-less.png';
import Refund from '../assets/refund.webp';

export const smartContractDetails = [
    {
        id: 'ERC721A',
        type: 'ERC721A',
        subtitle: '',
        founders: 'Created by Azuki Team',
        listOfPerks: ['Highly Known', 'Highly Optimized', 'Famous for cheap mint price'],
        fullDescription: ['The Azuki contract will enable minting multiple NFTs for essentially the same cost of minting a single NFT.'],
        fullDescription2: ['ERC721A is an improved implementation of the IERC721 standard that supports minting multiple tokens for close to the cost of one.'],
        image: Azuki,
        link: 'https://www.erc721a.org/'
    },
    {
        id: 'ERC721+',
        type: 'ERC721+',
        subtitle: '',
        founders: 'Community',
        listOfPerks: ['Save up to 70% on minting fees', 'Save up to 35% on transfer fees'],
        fullDescription: ['Replaced ERC721Enumerable', 'Replaced total supply reliant functions with a counters solution'],
        fullDescription2: ['Changed Your Contract’s Counter Logic', 'Checked for unobvious ERC721Enumerable imports'],
        image: GasLess,
        link: 'https://shiny.mirror.xyz/OUampBbIz9ebEicfGnQf5At_ReMHlZy0tB4glb9xQ0E'
    },
    {
        id: 'ERC721R',
        type: 'ERC721R',
        subtitle: '',
        founders: 'Cut Gas Fee Up To 70% and refund logic',
        listOfPerks: ['Low risk purchase', 'Protects against rug pulls', 'Forces greater accountability '],
        fullDescription: ['Builds trust with buyers'],
        fullDescription2: ['The project floor price is unlikely to drop below the mint price while refunds are open ', 'Short term flippers leave the project early leaving a high quality core intact'],
        image: Refund,
    },
]