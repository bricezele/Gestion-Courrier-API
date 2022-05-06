/**
 * Project gestion-courrier-api
 * File courrierstatus.enum
 * Path src/enum
 * Created by BRICE ZELE
 * Date: 21/03/2022
 */
export enum CourrierStatus {
    PENDING = 'pending',
    EN_ATTENTE_VALIDATION_1 = 'en_attente_validation_1',
    EN_ATTENTE_VALIDATION_2 = 'en_attente_validation_2',
    EN_ATTENTE_COTATION_APPROBATION_DGA = 'en_attente_cotation_approbation_dga',
    VALIDE_APPROUVE = 'valide_approuve',
    COTATION_APPROUVE = 'cotation_approuve',
    COTATION_REFUSE = 'cotation_refuse',
    ARCHIVE = 'archive',
}
