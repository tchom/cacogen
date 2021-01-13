const { Proxy } = require('@koreez/pure-mvc');
import { GameCommands } from '../../controller/GameCommands';
const { GameCharacterVO } = require('./GameCharacterVO');


export class GameCharacterProxy extends Proxy {
    get vo() {
        return this.getData();
    }
    static get NAME() { return "GameCharacterProxy_" };

    constructor(params) {
        super(GameCharacterProxy.NAME + params.id, new GameCharacterVO(params));
    }

    resetCombatTurnState() {
        this.vo.availableMovement = this.vo.maxMovement;
        this.vo.availableActions = this.vo.maxActionsPerTurn;
    }

    useMovement(cost) {
        this.vo.availableMovement -= cost;
    }

    applyDamage(damange) {
        this.vo.currentStamina -= damange;
        this.vo.currentStamina = Math.max(0, this.vo.currentStamina);

        if (this.vo.currentStamina > 0) {
            // Alive
            this.facade.sendNotification(GameCommands.UPDATE_STAMINA + this.id,
                this.vo.currentStamina, this.vo.maximumStamina);
        } else {
            // Dead
            console.log(`${this.id} died`);
        }

        this.facade.sendNotification(GameCommands.CHANGE_STAMINA + this.id, this.vo.currentStamina, this.vo.maxStamina);
    }

    getSkillTotal(skillKey) {
        if (this.vo.advancedSkills.has(skillKey)) {
            return this.skill + this.vo.advancedSkills.get(skillKey);
        } else {
            return this.skill;
        }
    }

    get id() {
        return this.vo.id;
    }

    get dialogueTree() {
        return this.vo.dialogueTree;
    }

    get currentNode() {
        return this.vo.currentNode;
    }

    set currentNode(value) {
        if (this.vo.currentNode) {
            this.vo.currentNode.occupied = false;
        }

        this.vo.currentNode = value;
        this.vo.currentNode.occupied = true;
    }

    get combatGroup() {
        return this.vo.combatGroup;
    }

    get isNPC() {
        return this.vo.isNPC;
    }

    get availableMovement() {
        return this.vo.availableMovement;
    }

    set availableMovement(value) {
        this.vo.availableMovement = value;
    }

    get availableActions() {
        return this.vo.availableActions;
    }

    set availableActions(value) {
        this.vo.availableActions = value;
        this.facade.sendNotification(GameCommands.USE_ACTION + this.id,
            this.availableActions, this.maxActionsPerTurn);
    }

    get maxActionsPerTurn() {
        return this.vo.maxActionsPerTurn;
    }

    get skill() {
        return this.vo.skill;
    }

    get currentStamina() {
        return this.vo.currentStamina;
    }

    set currentStamina(value) {
        this.vo.currentStamina = value;
    }

    get currentLuck() {
        return this.vo.currentStamina;
    }

    get isDead() {
        return this.vo.currentStamina <= 0;
    }

    get botBehaviour() {
        return this.vo.botBehaviour;
    }

    get equippedWeapon() {
        return this.vo.equippedWeapon;
    }

    set equippedWeapon(value) {
        this.vo.equippedWeapon = value;
    }

    get height() {
        return this.vo.height;
    }

    // Inventory 
    reorderInventoryItem(itemUUID, slotIndex) {
        // Delete the item from it's current position
        const originalIndex = this.inventoryItems.findIndex(item => item.uuid === itemUUID);
        const originalItem = this.inventoryItems.splice(originalIndex, 1);
        let runningIndexTotal = 0;
        let newIndex = 0;
        for (let i = 0; i < this.inventoryItems.length; i++) {
            const item = this.inventoryItems[i];


            if (slotIndex >= runningIndexTotal && slotIndex < runningIndexTotal + item.size) {
                newIndex = i;
            }

            runningIndexTotal += item.size;
        }

        if (slotIndex >= runningIndexTotal) {
            newIndex = this.inventoryItems.length;
        }

        // Make sure a valid array is provided
        if (Object.prototype.toString.call(this.inventoryItems) !== '[object Array]') {
            throw new Error('Please provide a valid array');
        }



        // Make sure there's an item to move
        if (!originalItem.length) {
            throw new Error('There is no item in the array at index ' + originalIndex);
        }

        // Move the item to its new position
        this.inventoryItems.splice(newIndex, 0, originalItem[0]);
    }

    attemptToEquipItemToSlot(slotKey, itemData) {
        // check equip weapon
        if ((slotKey === '1hand' || slotKey === '2hand') && itemData.type === "weapon") {
            const existingItem = this.equipmentSlots.get(slotKey);

            // Clear both slots it last item was two-handed
            if (existingItem && existingItem.equipSlot === '2hand') {
                this.equipmentSlots.delete('1hand');
                this.equipmentSlots.delete('2hand');
            }

            if (itemData.equipSlot === '1hand') {
                this.equipmentSlots.set(slotKey, itemData);
                // make sure this isn't already equipped in the other hand
                if (slotKey === '1hand') {
                    const otherSlot = this.equipmentSlots.get('2hand');
                    if (otherSlot && otherSlot.uuid === itemData.uuid) {
                        this.equipmentSlots.delete('2hand');
                    }
                } else if (slotKey === '2hand') {
                    const otherSlot = this.equipmentSlots.get('1hand');
                    if (otherSlot && otherSlot.uuid === itemData.uuid) {
                        this.equipmentSlots.delete('1hand');
                    }
                }


            } else {
                this.equipmentSlots.set('1hand', itemData);
                this.equipmentSlots.set('2hand', itemData);

            }

            return true;
        }

        // Attempt to equip armour
        if (slotKey === 'armour' && itemData.type === "armour") {
            this.equipmentSlots.set(slotKey, itemData);
            return true;
        }


        return false;
    }

    addInventoryItem(inventoryItemData) {
        this.inventoryItems.push(inventoryItemData);
    }

    getEquippedItem(slotKey) {
        return this.equipmentSlots.get(slotKey);
    }

    get inventoryItems() {
        return this.vo.inventoryItems;
    }

    set inventoryItems(value) {
        this.vo.inventoryItems = value;
    }

    get equipmentSlots() {
        return this.vo.equipmentSlots;
    }

    get currentArmour() {
        let armour = 0;

        for (const [key, value] of this.vo.equipmentSlots.entries()) {
            if (value.properties.armour) {
                armour += value.properties.armour;
            }
        }
        return armour;
    }

}
