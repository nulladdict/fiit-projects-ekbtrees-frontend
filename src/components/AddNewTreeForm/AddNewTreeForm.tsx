import cn from 'classnames';
import React, {Component} from 'react';
import {addTree, deleteFile, uploadFiles} from "./actions";
import FileUpload from "../FileUpload";
import TextField from '../TextField';
import Select from '../Select';
import styles from "./AddNewTreeForm.module.css";
import {getFilesByIds, getTypesOfTrees} from "../EditTreeForm/actions";
import {
    ResourceAction, INewTree, ITreePropertyValue,
    FileGroupType, IPostJsonTree, IGeographicalPoint, IFile
} from "../../common/types";
import {IAddNewTreeFormProps, IAddNewTreeFormState} from "./types";
import {
    conditionAssessmentOptions, treePlantingTypeOptions, treeStatusOptions,
    validateIsNotNegativeNumber, validateLessThan, validateIsSet, validateGreaterThan,
} from "../../common/treeForm";
import Modal from "../Modal";


export default class AddNewTreeForm extends Component<IAddNewTreeFormProps, IAddNewTreeFormState> {
    private addTreeInProgress = false;
    constructor(props: IAddNewTreeFormProps) {
        super(props);

        this.state = {
            errors: {},
            modalShow: false,
            successfullyAdded: false,
            tree: {
                latitude: {
                    disabled: true,
                    title: 'Широта',
                    value: this.props.match.params.lat,
                    type: 'string'
                },
                longitude: {
                    disabled: true,
                    title: 'Долгота',
                    value: this.props.match.params.lng,
                    type: 'string'
                },
                speciesId: {
                    title: 'Порода',
                    values: [],
                    value: '',
                    // validate: validateIsSet,
                    // required: true,
                    loading: false
                },
                conditionAssessment: {
                    title: 'Визуальная оценка состония',
                    value: '',
                    values: conditionAssessmentOptions,
                    loading: false
                },
                diameterOfCrown: {
                    title: 'Диаметр кроны (в метрах)',
                    value: '',
                    type: 'number',
                    validate: (v) => validateIsNotNegativeNumber(v) || validateLessThan(v, 50),
                    parse: (value: string) => parseFloat(value)
                },
                heightOfTheFirstBranch: {
                    title: 'Высота первой ветви от земли (в метрах)',
                    value: '',
                    type: 'number',
                    validate: (v) => validateIsNotNegativeNumber(v) || validateLessThan(v, 100),
                    parse: (value: string) => parseFloat(value)
                },
                numberOfTreeTrunks: {
                    title: 'Число стволов',
                    value: '',
                    type: 'number',
                    validate: (v) => validateGreaterThan(v, 0) || validateLessThan(v, 20),
                    parse: (value: string) => parseInt(value, 10)
                },
                treeHeight: {
                    title: 'Высота (в метрах)',
                    value: '',
                    type: 'number',
                    validate: (v) => validateIsNotNegativeNumber(v) || validateLessThan(v, 100),
                    parse: (value: string) => parseFloat(value)
                },
                age: {
                    title: 'Возраст (в годах)',
                    value: '',
                    type: 'number',
                    parse: (value: string) => parseInt(value, 10),
                    validate: validateIsNotNegativeNumber,
                },

                status: {
                    title: 'Статус дерева',
                    values: treeStatusOptions,
                    value: '',
                    loading: false,
                    parse: this.toStr
                },
                treePlantingType: {
                    title: 'Тип посадки дерева',
                    value: '',
                    values: treePlantingTypeOptions,
                    parse: this.toStr
                },
                trunkGirth: {
                    title: 'Обхват самого толстого ствола (в сантиметрах)',
                    value: '',
                    type: 'number',
                    validate: (v) => validateIsNotNegativeNumber(v) || validateLessThan(v, 1600),
                    parse: (value: string) => parseFloat(value)
                },
                fileIds: [],
            },
            files: [],
            images: [],
            uploadingFiles: false,
            uploadingImages: false
        };
    }

    sortTypesOfTrees (types: ITreePropertyValue[]) {
        return types
            .sort((first: ITreePropertyValue, second: ITreePropertyValue) => {
                if (first.title > second.title) return 1;
                if (first.title < second.title) return -1;
                return 0;
            })
    }

    toStr = (value: string, values: ITreePropertyValue[]) => {
        const item = values.find(item => item.id === value);
        return `${item ? item.title: ''}`;
    }

    validateTree(tree: INewTree) {
        const errors: {[key: string]: string} = {};
        Object.keys(tree).forEach((key: string) => {
            const newTreeKey = key as keyof INewTree;
            const field = tree[newTreeKey];
            if (Array.isArray(field)) return;
            if (field.validate) {
                const errorMessage = field.validate(field.value);
                if (errorMessage !== null) {
                    errors[newTreeKey] = errorMessage;
                }
            }
        });
        this.setState({errors: errors});
        return Object.keys(errors).length === 0;
    }

    convertINewTreeToIPostJsonTree(tree: INewTree) {
        const data: IPostJsonTree = {
            geographicalPoint: {
                latitude: null,
                longitude: null
            }
        }

        Object.keys(tree).forEach((key: string) => {
            const treeKey = key as keyof INewTree;

            if (Object.prototype.hasOwnProperty.call(tree[treeKey], 'value')) {
                if (treeKey == 'fileIds') {
                    // should be in else branch
                    return;
                }
                // TODO: find other way to filter this case

                const {parse, value, values} = tree[treeKey];
                if (value === null || value === undefined || value === '') {
                    return;
                }

                if (parse && !(treeKey === 'latitude' || treeKey === 'longitude')) {
                    data[treeKey] = parse(value, values);
                } else if (treeKey === 'latitude' || treeKey === 'longitude') {
                    if (!data.geographicalPoint) {
                        data.geographicalPoint = {
                            latitude: null,
                            longitude: null
                        };
                    }
                    data.geographicalPoint[treeKey as keyof IGeographicalPoint] = parseFloat(String(value));
                } else {
                    data[treeKey] = value;
                }
            } else {
                if (treeKey !== 'latitude' && treeKey !== 'longitude') {
                    data[treeKey] = tree[treeKey];
                }
            }
        });
        return data;
    }

    handleAddTree = () => {
        if (this.addTreeInProgress) return;
        this.addTreeInProgress = true;
        const {tree} = this.state;

        const isValid = this.validateTree(tree);
        if (!isValid) {
            return;
        }
        const data: IPostJsonTree = this.convertINewTreeToIPostJsonTree(tree);
        addTree(data as {geographicalPoint: {latitude: number | null, longitude: number | null}})
            .then(_ => {
                const lat = data.geographicalPoint?.latitude;
                const lng = data.geographicalPoint?.longitude;
                if (lat && lng) {
                    this.props.setMapViewPosition({lat, lng}); // set map position on success
                }
                this.setState({modalShow: true, modalMessage: 'Дерево успешно добавлено!', successfullyAdded: true});
                this.addTreeInProgress = false;
            })
            .catch(error => {
                this.setState({modalShow: true, modalMessage: 'Ошибка при добавлении дерева'});
                console.error('Ошибка при добавлении дерева', error);
                this.addTreeInProgress = false;
            });
    }

    handleChange = (fieldName: keyof INewTree) => (event: React.ChangeEvent<{name?: string | undefined, value: unknown}>) => {
        if (fieldName == 'fileIds') {
            // TODO: find other way to filter this case
            return;
        }
        const {tree} = this.state;
        tree[fieldName].value = event.target.value as string;

        this.setState({tree});
    }

    handleOpenSelect = (fieldId: string) => () => {
        const {tree} = this.state;

        if (fieldId === 'speciesId') {
            this.setState({
                tree: {
                    ...tree,
                    speciesId: {
                        ...tree.speciesId,
                        loading: true
                    }
                }
            }, () => {
                getTypesOfTrees()
                    .then((types: ITreePropertyValue[]) => {
                        this.setState({
                            tree: {
                                ...tree,
                                speciesId: {
                                    ...tree.speciesId,
                                    values: this.sortTypesOfTrees(types),
                                    loading: false
                                }
                            }
                        })
                    })
                    .catch(error => {
                        this.setState({
                            tree: {
                                ...tree,
                                speciesId: {
                                    ...tree.speciesId,
                                    loading: false
                                }
                            }
                        })

                        console.error('Возникла ошибка при получении типов', error);
                    })
            })
        }
    }

    handleModalClose = () => {
        this.setState({modalShow: false});
        if (this.state.successfullyAdded) {
            this.props.history.goBack();
        }
    }

    renderErrors() {
        const {errors} = this.state;
        if (Object.keys(errors).length === 0) {
            return null;
        }
        return Object.keys(errors).map(
            (fieldName: string) => {
                let title: string | undefined = fieldName;
                const field = this.state.tree[fieldName as keyof INewTree];
                if ("title" in field) {
                    title = field.title;
                }

                return (
                    <p className={styles.errorMessage} key={fieldName}>{title}: {errors[fieldName]}</p>
                );
            }
        )
    }

    renderItems () {
        const {tree} = this.state;

        const result: React.ReactNode[] = [];
        Object.keys(tree).forEach((key, index) => {
            const treeKey = key as keyof INewTree;
            // TODO: find other way to filter this case
            if (treeKey == 'fileIds') {
                // should be in else branch
                return;
            }
            if (tree[treeKey]) {
                if (Object.prototype.hasOwnProperty.call(tree[treeKey], 'values')) {
                    result.push(
                        <div key={index} className={cn([styles.blockWrapper, styles.blockWrapperDesktop])}>
                            <Select
                                onChange={this.handleChange(treeKey)}
                                onOpen={this.handleOpenSelect(key)}
                                item={tree[treeKey]}
                                id={key}
                                required={tree[treeKey].required}
                            />
                        </div>
                    )
                } else if (tree[treeKey].title) {
                    result.push(
                        <div key={tree[treeKey].title} className={cn([styles.blockWrapper, styles.blockWrapperDesktop])}>
                            <TextField
                                item={tree[treeKey]}
                                id={key}
                                onChange={this.handleChange(treeKey)}
                                errorMessage={this.state.errors[treeKey]}
                            />
                        </div>
                    )
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

    uploadFiles (files: (string | Blob)[], key: FileGroupType) {
        const camelCaseKey = key.charAt(0).toUpperCase() + key.slice(1) as "Files" | "Images";
        uploadFiles(files)
            .then(fileIds => {
                getFilesByIds(fileIds)
                    .then(files => {
                        const newFileIds = (this.state.tree?.fileIds ?? []).concat(fileIds);
                        const newState: IAddNewTreeFormState = {
                            ...this.state,
                            modalShow: false,
                            [key]: (this.state[key] === undefined) ? files : (this.state[key] ?? []).concat(files),
                            tree: {
                                ...this.state.tree,
                                fileIds: newFileIds
                            },
                            [`uploading${camelCaseKey}` as ResourceAction]: false
                        };

                        this.setState(newState)
                    })
                    .catch(error => {
                        this.setState({
                            ...this.state,
                            modalShow: false,
                            tree: {
                                ...this.state.tree,
                            },
                            [`uploading${camelCaseKey}` as ResourceAction]: false
                        })

                        throw `Произошла ошибка при получении загруженных файлов/картинок ${error}`;
                    })
            })
            .catch(error => {
                this.setState({
                    ...this.state,
                    modalShow: false,
                    tree: {
                        ...this.state.tree,
                    },
                    [`uploading${camelCaseKey}` as ResourceAction]: false
                })
                console.error('Ошибка при загрузке файлов/картинок', error)
            })
    }

    handleUploadFiles = (key: FileGroupType) => (files: File[]) => {
        const camelCaseKey = key.charAt(0).toUpperCase() + key.slice(1);

        this.setState({
            ...this.state,
            modalShow: false,
            tree: {
                ...this.state.tree,
            },
            [`uploading${camelCaseKey}` as ResourceAction]: true
        }, () => this.uploadFiles(files, key));
    }

    getFilesAfterDelete (id: string | number, key: FileGroupType = "images") {
        const {images, files} = this.state;
        switch (key) {
            case "images":
                return images?.filter((file: IFile) => file.id !== id);
            case "files":
                return files?.filter((file: IFile) => file.id !== id);
        }
    }

    getFileIdsAfterDelete (id: string | number) {
        const {tree} = this.state;
        return tree.fileIds.filter((fileId: string | number) => fileId !== id);
    }

    handleDeleteFile = (key: FileGroupType) => (id: string | number) => {
        deleteFile(id).then((succ) => {
            this.setState({
                ...this.state,
                modalShow: false,
                // Removed second parameter, func getFilesAfterDelete (id: any) uses only id
                [key]: this.getFilesAfterDelete(id, key),
                tree: {
                    ...this.state.tree,
                    fileIds: this.getFileIdsAfterDelete(id)
                }
            });
        });
    }

    renderFiles () {
        const {files, uploadingFiles} = this.state;
        return (
            <>
                <h3 className={styles.title}> Файлы </h3>
                <FileUpload
                    files={files ?? []}
                    onDelete={this.handleDeleteFile('files')}
                    onUpload={this.handleUploadFiles('files')}
                    uploading={uploadingFiles}
                />
            </>
        )
    }

    renderImages () {
        const {images, uploadingImages} = this.state;
        return (
            <>
                <h3 className={styles.title}> Картинки </h3>
                <FileUpload
                    files={images ?? []}
                    onDelete={this.handleDeleteFile('images')}
                    onUpload={this.handleUploadFiles('images')}
                    type="image"
                    uploading={uploadingImages}
                />
            </>
        )
    }

    renderButtons () {
        return (
            <div className={styles.buttons}>
                <button onClick={this.handleAddTree}
                        disabled={this.state.uploadingFiles}
                        className={styles.addButton}
                >
                    Добавить
                </button>
                <button
                    onClick={this.props.history.goBack}
                    className={styles.cancelButton}
                >
                    Отмена
                </button>
            </div>
        )
    }


    render() {
        return (
            <React.Fragment>
                <Modal show={this.state.modalShow} onClose={this.handleModalClose}>
                    <p>{this.state.modalMessage}</p>
                </Modal>
                <div className={styles.formContainer}>
                    <div className={styles.form}>
                        {this.renderMainInformation()}
                        {this.renderImages()}
                        {this.renderFiles()}
                        {this.renderErrors()}
                        {this.renderButtons()}
                    </div>
                </div>
            </React.Fragment>
        );
    }
};
