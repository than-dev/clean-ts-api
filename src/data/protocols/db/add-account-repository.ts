import { InsertOneResult } from 'mongodb';
import {
    AccountModel,
    AddAccountModel
} from '../../usecases/add-account/db-add-account-protocols';

export interface AddAccountRepository {
    add(
        account: AddAccountModel
    ): Promise<AccountModel | InsertOneResult<Document>>;
}
