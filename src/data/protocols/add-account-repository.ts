import { InsertOneResult } from 'mongodb';
import { AccountModel } from '../../domain/models/account';
import { AddAccountModel } from '../../domain/usecases/add-account';

export interface AddAccountRepository {
    add(
        account: AddAccountModel
    ): Promise<AccountModel | InsertOneResult<Document>>;
}
