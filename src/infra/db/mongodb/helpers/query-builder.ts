export class QueryBuilder {
    private readonly query = [];

    match(data: object): QueryBuilder {
        this.query.push({
            $match: data
        });

        return this;
    }

    group(data: object): QueryBuilder {
        this.query.push({
            $group: data
        });

        return this;
    }

    unwind(data: object): QueryBuilder {
        this.query.push({
            $group: data
        });

        return this;
    }

    lookup(data: object): QueryBuilder {
        this.query.push({
            $group: data
        });

        return this;
    }

    project(data: object): QueryBuilder {
        this.query.push({
            $group: data
        });

        return this;
    }

    addFields(data: object): QueryBuilder {
        this.query.push({
            $group: data
        });

        return this;
    }

    build(): object[] {
        return this.query;
    }
}
