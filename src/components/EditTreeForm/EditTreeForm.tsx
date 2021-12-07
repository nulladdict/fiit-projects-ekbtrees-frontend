import cn from "classnames";
import React, {ChangeEvent, Component} from 'react';
import styles from './EditTreeForm.module.css';
import {getUrlParamValueByKey} from '../../helpers/url';
import {
    editTree,
    getFilesByTree,
    getTree,
    getFilesByIds,
    getTypesOfTrees,
    uploadFilesByTree
} from "./actions";
import Spinner from "../Spinner/Spinner";
import FileUpload from "../FileUpload";
import TextField from '../TextField';
import Select from '../Select';
import {
    IEditedTree,
    IFile,
    IJsonTree,
    ITreePropertyValue,
    IPostJsonTree,
} from "../../common/types";
import { IEditTreeFormProps, IEditTreeFormState } from "./types";
import {conditionAssessmentOptions, treePlantingTypeOptions, treeStatusOptions} from "../../common/treeForm";


export class EditTreeForm extends Component<IEditTreeFormProps, IEditTreeFormState> {
    public treeUuid: string;

    constructor(props: IEditTreeFormProps) {
        super(props);
        // console.log(" > EditTreeForm: constructor ");
        // console.log(props);
        this.state = {
            tree: null,
            loading: true,
            files: [],
            loadingFiles: true,
            uploadingFiles: false,
            images: [],
            uploadingImages: false
        }

        this.treeUuid = getUrlParamValueByKey('tree');
    }

    convertTree (tree: IJsonTree) : IEditedTree {
        const {
            age,
            conditionAssessment,
            diameterOfCrown,
            heightOfTheFirstBranch,
            fileIds,
            geographicalPoint,
            numberOfTreeTrunks,
            treeHeight,
            species,
            status,
            treePlantingType,
            trunkGirth,
            id
        } = tree;

        let conditionAssessmentId = conditionAssessmentOptions.find(op => op.title === conditionAssessment)?.id ?? '';
        let treeStatusOptionId = treeStatusOptions.find(op => op.title === status)?.id ?? '';
        let treePlantingTypeId = treePlantingTypeOptions.find(op => op.title === treePlantingType)?.id ?? '';

        return {
            age: {
                title: 'Возраст (в годах)',
                value: age,
                type: 'number'
            },
            conditionAssessment: {
                title: 'Визуальная оценка состония',
                value: conditionAssessmentId,
                values: conditionAssessmentOptions,
                loading: false
            },
            diameterOfCrown: {
                title: 'Диаметр кроны (в метрах)',
                value: diameterOfCrown,
                type: 'number'
            },
            heightOfTheFirstBranch: {
                title: 'Высота первой ветви от земли (в метрах)',
                value: heightOfTheFirstBranch,
                type: 'number'
            },
            numberOfTreeTrunks: {
                title: 'Число стволов',
                value: numberOfTreeTrunks,
                type: 'number'
            },
            treeHeight: {
                title: 'Высота (в метрах)',
                value: treeHeight,
                type: 'number'
            },
            species: {
                title: 'Порода',
                values: species && [species],
                value: species?.id,
                loading: false
            },
            status: {
                title: 'Статус дерева',
                values: treeStatusOptions,
                value: treeStatusOptionId,
                loading: false
            },
            treePlantingType: {
                title: 'Тип посадки дерева',
                value: treePlantingTypeId,
                values: treePlantingTypeOptions
            },
            trunkGirth: {
                title: 'Обхват самого толстого ствола (в сантиметрах)',
                value: trunkGirth,
                type: 'number'
            },
            id,
            fileIds: fileIds || [],
            geographicalPoint
        }
    }

    sortTypesOfTrees (types: ITreePropertyValue[]) {
        return types
            .sort((first: ITreePropertyValue, second: ITreePropertyValue) => {
                if (first.title > second.title) return 1;
                if (first.title < second.title) return -1;
                return 0;
            })
    }

    componentDidMount() {
        if (this.treeUuid) {
            getTree(this.treeUuid)
                .then((tree: IJsonTree) => {
                    this.setState({
                        tree: this.convertTree(tree),
                        loading: false
                    }, () => {
                        getFilesByTree(tree.fileIds ?? []) // TODO: Find out if it's test data
                            .then((files: IFile[]) => {
                                const images = files.filter((file: IFile) => file.mimeType.startsWith('image'));
                                const filesWithoutImages = files.filter((file: IFile) => !file.mimeType.startsWith('image'));

                                this.setState({
                                    files: filesWithoutImages,
                                    tree: {
                                        ...this.state.tree,
                                        fileIds: tree.fileIds
                                    },
                                    images,
                                    loadingFiles: false
                                })
                            })
                            .catch(error => {
                                console.error(error, 'Ошибка при загрузке файлов!');
                                this.setState({
                                    loadingFiles: false
                                })
                            })
                    })
                })
                .catch(error => {
                    console.error(error, 'Ошибка!')
                    this.setState({
                        loading: false
                    })
                })
        }
    }


    handleEditTree = () => {
        const {tree} = this.state;
        if (!tree) {
            return;
        }
        const data: IPostJsonTree = {};
        // console.log("> handleEditTree: tree");
        // console.log(tree);
        Object.keys(tree).forEach(key => {
            const jsonTreeKey = key as keyof IJsonTree;
            if (jsonTreeKey === "fileIds" && !tree[jsonTreeKey]) {
                tree[jsonTreeKey] = [];
            }
            if (tree[jsonTreeKey] && Object.prototype.hasOwnProperty.call(tree[jsonTreeKey], 'value')) {
                // const selects = ['species', 'treePlantingType', 'conditionAssessment'];
                // const selects = ['species', 'treePlantingType'];
                const selects = ['species'];
                // const selects = ['never'];

                if (selects.includes(jsonTreeKey)) {
                    // if (jsonTreeKey === "species") {
                        //@ts-ignore: must be protected by a condition from above
                        // data["speciesId"] = {id: tree[jsonTreeKey]?.value}
                    // } else {
                        //@ts-ignore: must be protected by a condition from above
                        data[jsonTreeKey] = tree[jsonTreeKey].values.find(s => s.id === tree[jsonTreeKey]?.value) //{id: tree[jsonTreeKey]?.value}
                    // }
                } else {
                    if (jsonTreeKey === "species") {
                        //@ts-ignore: must be protected by a condition from above
                        data["speciesId"] = tree[jsonTreeKey].value;
                    } else if (jsonTreeKey === "status") {
                        //@ts-ignore: must be protected by a condition from above
                        data[jsonTreeKey] = treeStatusOptions.find(op => op.id === tree[jsonTreeKey].value)?.title ;
                    } else if (jsonTreeKey === "treePlantingType") {
                        //@ts-ignore: must be protected by a condition from above
                        data[jsonTreeKey] = treePlantingTypeOptions.find(op => op.id === tree[jsonTreeKey].value)?.title ;
                    } else {
                        //@ts-ignore: must be protected by a condition from above
                        data[jsonTreeKey] = tree[jsonTreeKey].value;
                    }
                }
            } else {
                //@ts-ignore: must be protected by a condition from above
                data[jsonTreeKey] = tree[jsonTreeKey];
            }
        })
        data.authorId = this.props.user?.id;
        data.created = "2021-11-16T06:09:02.141Z"; // TODO: use real dates
        data.updated = "2021-11-16T06:09:02.141Z"; // TODO: use real dates
        // console.log("> handleEditTree: data");
        // console.log(data);
        editTree(data)
            .then(_ => {
                alert('Дерево успешно изменено!');
                this.props.history.goBack();
            })
            .catch(error => {
                alert('Ошибка при изменении дерева');
                console.error('Ошибка при изменении дерева', error);
            });
    }

    handleChange = (fieldName: keyof IEditedTree) => (event: ChangeEvent<{ name?: string | undefined; value: unknown; }>) => {
        const {tree} = this.state;
        if (!tree) {
            return;
        }
        if (fieldName !== 'id' && fieldName !== 'geographicalPoint' && fieldName !== 'fileIds')
            tree[fieldName]!.value = "" + event.target.value as any; // to use unknown value

        this.setState({tree})
    }

    handleOpenSelect = (type: string) => () => {
        const {tree} = this.state;

        if (type === 'species') {
            this.setState({
                tree: {
                    ...tree,
                    species: {
                        ...tree?.species,
                        loading: true
                    }
                }
            }, () => {
                getTypesOfTrees()
                    .then(types => {
                        this.setState({
                            tree: {
                                ...tree,
                                species: {
                                    ...tree?.species,
                                    values: this.sortTypesOfTrees(types),
                                    loading: false
                                }
                            }
                        });
                    })
                    .catch(error => {
                        this.setState({
                            tree: {
                                ...tree,
                                species: {
                                    ...tree?.species,
                                    loading: false
                                }
                            }
                        })

                        console.error('Возникла ошибка при получении типов', error);
                    })
            })
        }
    }

    renderItems () {
        const {tree} = this.state;
        if (!tree) {
            return;
        }
        const result: JSX.Element[]  = [];
        Object.keys(tree).forEach((keyStr, index) => {
            const key = keyStr as keyof IEditedTree;
            if (tree[key]) {
                if (key !== 'id' && key !== 'geographicalPoint' && key !== 'fileIds') {
                    if (Object.prototype.hasOwnProperty.call(tree[key], 'values')) {
                        result.push(
                            <div key={index} className={cn([styles.blockWrapper, styles.blockWrapperDesktop])}>
                                <Select
                                    onChange={this.handleChange(key)}
                                    onOpen={this.handleOpenSelect(key)}
                                    item={tree[key]!} id={key} // must be protected by a condition from above
                                />
                            </div>
                        );
                    } else if (tree[key]?.title) {
                        result.push(
                            <div key={index} className={cn([styles.blockWrapper, styles.blockWrapperDesktop])}>
                                <TextField
                                    item={tree[key]!} // must be protected by a condition from above
                                    id={key}
                                    onChange={this.handleChange(key)}
                                />
                            </div>
                        )
                    }
                }
            }
        })

        return result;
    }

    renderMainInformation () {
        return (
            <div className={styles.block}>
                <div className={styles.wrapperFlex}>
                    {this.renderItems()}
                </div>
            </div>
        )
    }

    uploadFiles (files: File[], keyStr: string) {
        const camelCaseKey = keyStr.charAt(0).toUpperCase() + keyStr.slice(1);
        const key = keyStr as keyof IEditTreeFormState;

        uploadFilesByTree(this.treeUuid, files)
            .then(fileIds => {
                getFilesByIds(fileIds)
                    .then(files => {
                        this.setState({
                            [key]: this.state[key].concat(files),
                            tree: {
                                ...this.state.tree,
                                fileIds: this.state.tree?.fileIds?.concat(fileIds),
                            } as IEditedTree,
                            [`uploading${camelCaseKey}`]: false
                        })
                    })
                    .catch(error => {
                        this.setState({
                            [`uploading${camelCaseKey}`]: false
                        })

                        throw new Error (`Произошла ошибка при получении загруженных файлов/картинок ${error}`);
                    })
            })
            .catch(error => {
                this.setState({
                    [`uploading${camelCaseKey}`]: false
                })
                console.error('Ошибка при загрузке файлов/картинок', error)
            })
    }

    handleUploadFiles = (key: string) => (files: File[]) => {
        const camelCaseKey = key.charAt(0).toUpperCase() + key.slice(1);

        this.setState({
            [`uploading${camelCaseKey}`]: true
        }, () => this.uploadFiles(files, key));
    }

    getFilesAfterDelete (id: string | number, key: string) {
        return this.state[key].filter((file: IFile) => file.id !== id);
    }

    getFileIdsAfterDelete (id: string | number) {
        const {tree} = this.state;
        return tree?.fileIds?.filter((fileId: string | number) => fileId !== id);
    }

    handleDeleteFile = (key: string) => (id: string | number) => {
        this.setState({
            [key]: this.getFilesAfterDelete(id, key),
            tree: {
                ...this.state.tree,
                fileIds: this.getFileIdsAfterDelete(id)
            }
        });
    }

    renderFiles () {
        const {files, loadingFiles, uploadingFiles} = this.state;

        if (loadingFiles) {
            return <Spinner />;
        }

        return (
            <>
                <h3 className={styles.title}> Файлы </h3>
                <FileUpload
                    files={files}
                    onDelete={this.handleDeleteFile('files')}
                    onUpload={this.handleUploadFiles('files')}
                    uploading={uploadingFiles}
                />
            </>
        )
    }

    renderImages () {
        const {images, loadingFiles, uploadingImages} = this.state;

        if (loadingFiles) {
            return <Spinner />;
        }

        return (
            <>
                <h3 className={styles.title}> Картинки </h3>
                <FileUpload
                    files={images}
                    onDelete={this.handleDeleteFile('images')}
                    onUpload={this.handleUploadFiles('images')}
                    type="image"
                    uploading={uploadingImages}
                />
            </>
        )
    }

    renderContent () {
        const {loading} = this.state;

        if (loading) {
            return <Spinner />
        }

        return (
            <div className={styles.form}>
                {this.renderMainInformation()}
                {this.renderImages()}
                {this.renderFiles()}
                {this.renderButtons()}
            </div>
        )
    }

    renderButtons () {
        return (
            <div className={styles.buttons}>
                <button disabled={this.state.uploadingFiles || this.state.uploadingImages} className={styles.addButton} onClick={this.handleEditTree}>Редактировать</button>
                <button onClick={this.props.history.goBack} className={styles.cancelButton}>Отмена</button>
            </div>
        )
    }


    render() {
        return (
            <div className={styles.formContainer}>
                {this.renderContent()}
            </div>
        );
    }
}

export default EditTreeForm;
